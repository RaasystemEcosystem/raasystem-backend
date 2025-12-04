+ // ================================
# Fully Automated ECS/Fargate + ALB Deployment (Node.js) + Route53 DNS
# ================================

# ------------------------------
# Variables
# ------------------------------
$AWS_REGION = "us-east-2"
$AWS_ACCOUNT_ID = "724772066825"
$ECR_REPO = "raasystem-backend"
$IMAGE_TAG = "latest"
$CLUSTER_NAME = "raasystem-cluster"
$SERVICE_NAME = "raasystem-service"
$TASK_NAME = "raasystem-task"
$CONTAINER_NAME = "raasystem-container"
$ALB_NAME = "raasystem-alb"
$TARGET_GROUP_NAME = "raasystem-tg"
$DOMAIN_NAME = "raasystem-backend.mydomain.com"
$HOSTED_ZONE_NAME = "mydomain.com."  # Your Route53 hosted zone
$VPC_ID = "vpc-0a1b2c3d4e5f6g7h"
$SUBNETS = @("subnet-0123456789abcdef0","subnet-0fedcba9876543210")
$SECURITY_GROUP = "sg-0a1b2c3d4e5f6g7h"

# ------------------------------
# Step 1: Create ECR repo
# ------------------------------
aws ecr describe-repositories --repository-names $ECR_REPO --region $AWS_REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Output "Creating ECR repository $ECR_REPO..."
    aws ecr create-repository --repository-name $ECR_REPO --region $AWS_REGION
}

# ------------------------------
# Step 2: Docker build, tag, push
# ------------------------------
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
docker build -t $ECR_REPO .
docker tag "$ECR_REPO:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest"

# ------------------------------
# Step 3: Create ECS cluster
# ------------------------------
aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Output "Creating ECS cluster $CLUSTER_NAME..."
    aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION
}

# ------------------------------
# Step 4: Create Target Group
# ------------------------------
$tg = aws elbv2 create-target-group `
    --name $TARGET_GROUP_NAME `
    --protocol HTTP `
    --port 8000 `
    --vpc-id $VPC_ID `
    --target-type ip `
    --health-check-path /api/docs `
    --health-check-port 8000 `
    --region $AWS_REGION | ConvertFrom-Json
$TARGET_GROUP_ARN = $tg.TargetGroups[0].TargetGroupArn
Write-Output "Target Group ARN: $TARGET_GROUP_ARN"

# ------------------------------
# Step 5: Create ALB
# ------------------------------
$alb = aws elbv2 create-load-balancer `
    --name $ALB_NAME `
    --subnets $SUBNETS `
    --security-groups $SECURITY_GROUP `
    --scheme internet-facing `
    --type application `
    --region $AWS_REGION | ConvertFrom-Json
$ALB_ARN = $alb.LoadBalancers[0].LoadBalancerArn

# ------------------------------
# Step 5.1: Wait for ALB to become active
# ------------------------------
Write-Output "Waiting for ALB to become active..."
do {
    Start-Sleep -Seconds 5
    $albStatus = aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --region $AWS_REGION | ConvertFrom-Json
} while ($albStatus.LoadBalancers[0].State.Code -ne "active")
$ALB_DNS = $albStatus.LoadBalancers[0].DNSName
Write-Output "ALB is active! DNS: $ALB_DNS"

# ------------------------------
# Step 6.2: Wait for ACM certificate to be issued
# ------------------------------
Write-Output "Waiting for ACM certificate to be issued..."
do {
    Start-Sleep -Seconds 15
    $certStatus = aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION | ConvertFrom-Json
    $state = $certStatus.Certificate.Status
    Write-Output "Certificate status: $state"
} while ($state -ne "ISSUED")
Write-Output "✅ ACM certificate issued!"

# ------------------------------
# Step 6.1: Automatically create Route53 validation record
# ------------------------------
$certDetail = aws acm describe-certificate --certificate-arn $CERT_ARN --region $AWS_REGION | ConvertFrom-Json
$dnsValidation = $certDetail.Certificate.DomainValidationOptions[0].ResourceRecord

# Create DNS validation record in Route53
aws route53 change-resource-record-sets `
    --hosted-zone-id $(aws route53 list-hosted-zones-by-name --dns-name $HOSTED_ZONE_NAME --query "HostedZones[0].Id" --output text) `
    --change-batch "{
        \"Changes\": [
            {
                \"Action\": \"UPSERT\",
                \"ResourceRecordSet\": {
                    \"Name\": \"$($dnsValidation.Name)\",
                    \"Type\": \"$($dnsValidation.Type)\",
                    \"TTL\": 300,
                    \"ResourceRecords\": [{\"Value\": \"$($dnsValidation.Value)\"}]
                }
            }
        ]
    }" --region $AWS_REGION
Write-Output "DNS validation record created. Waiting for certificate validation..."
Start-Sleep -Seconds 60  # Wait for DNS to propagate

# ------------------------------
# Step 7: Create HTTPS listener
# ------------------------------
$listener = aws elbv2 create-listener `
    --load-balancer-arn $ALB_ARN `
    --protocol HTTPS `
    --port 443 `
    --certificates CertificateArn=$CERT_ARN `
    --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN `
    --region $AWS_REGION | ConvertFrom-Json

# ------------------------------
# Step 8: Register ECS Task Definition
# ------------------------------
$taskDef = @{
    family = $TASK_NAME
    networkMode = "awsvpc"
    requiresCompatibilities = @("FARGATE")
    cpu = "512"
    memory = "1024"
    containerDefinitions = @(
        @{
            name = $CONTAINER_NAME
            image = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest"
            essential = $true
            portMappings = @(@{containerPort=8000; protocol="tcp"})
        }
    )
} | ConvertTo-Json -Depth 10

$taskDef | Out-File taskdef.json
aws ecs register-task-definition --cli-input-json file://taskdef.json --region $AWS_REGION

# ------------------------------
# Step 9: Create ECS Service
# ------------------------------
$subnetsString = $SUBNETS -join ","
aws ecs create-service `
    --cluster $CLUSTER_NAME `
    --service-name $SERVICE_NAME `
    --task-definition $TASK_NAME `
    --launch-type FARGATE `
    --desired-count 1 `
    --network-configuration "awsvpcConfiguration={subnets=[$subnetsString],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" `
    --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=$CONTAINER_NAME,containerPort=8000" `
    --region $AWS_REGION

Write-Output "✅ Deployment initiated!"
Write-Output "Your Node.js backend Swagger UI is available at: https://$DOMAIN_NAME/api/docs"
Write-Output "Or temporarily via ALB DNS: https://$ALB_DNS/api/docs"
