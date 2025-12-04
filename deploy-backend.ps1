# ================================
# Fully Automated ECS/Fargate + ALB Deployment (Node.js)
# ================================

# ------------------------------
# Variables (replace placeholders)
# ------------------------------
$AWS_REGION        = "us-east-2"
$AWS_ACCOUNT_ID    = "724772066825"
$ECR_REPO          = "raasystem-backend"
$IMAGE_TAG         = "latest"
$CLUSTER_NAME      = "raasystem-cluster"
$SERVICE_NAME      = "raasystem-service"
$TASK_NAME         = "raasystem-task"
$CONTAINER_NAME    = "raasystem-container"
$ALB_NAME          = "raasystem-alb"
$TARGET_GROUP_NAME = "raasystem-tg"
$DOMAIN_NAME       = "raasystem-backend.mydomain.com"  # Optional
$CERT_ARN          = "arn:aws:acm:us-east-2:724772066825:certificate/abcd1234-5678-90ef-ghij-klmnopqrstuv"
$VPC_ID            = "vpc-0123456789abcdef0"
$SUBNETS           = "subnet-0123456789abcdef0,subnet-0fedcba9876543210"
$SECURITY_GROUP    = "sg-0123456789abcdef0"

# Fully qualified ECR URI
$ECR_URI = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

# ------------------------------
# Step 1: Create ECR repo if missing
# ------------------------------
try {
    aws ecr describe-repositories --repository-names $ECR_REPO --region $AWS_REGION | Out-Null
    Write-Output "✅ ECR repository exists: $ECR_REPO"
} catch {
    Write-Output "Creating ECR repository $ECR_REPO..."
    aws ecr create-repository --repository-name $ECR_REPO --region $AWS_REGION
}

# ------------------------------
# Step 2: Docker build, tag, push
# ------------------------------
try {
    docker build -t $ECR_REPO .
    docker tag "$ECR_REPO:latest" "$ECR_URI:latest"
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    docker push "$ECR_URI:latest"
    Write-Output "✅ Docker image pushed: $ECR_URI:latest"
} catch {
    Write-Error "❌ Docker build/push failed. Check Docker and AWS CLI setup."
    exit 1
}

# ------------------------------
# Step 3: Create ECS Cluster if missing
# ------------------------------
try {
    $cluster = aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION | ConvertFrom-Json
    if ($cluster.clusters.Count -eq 0) {
        Write-Output "Creating ECS cluster $CLUSTER_NAME..."
        aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION
    } else {
        Write-Output "✅ ECS cluster exists: $CLUSTER_NAME"
    }
} catch {
    Write-Error "❌ ECS cluster creation/check failed."
    exit 1
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
Write-Output "✅ Target Group ARN: $TARGET_GROUP_ARN"

# ------------------------------
# Step 5: Create ALB
# ------------------------------
$subnetArray = $SUBNETS.Split(',')
$alb = aws elbv2 create-load-balancer `
    --name $ALB_NAME `
    --subnets $subnetArray `
    --security-groups $SECURITY_GROUP `
    --scheme internet-facing `
    --type application `
    --region $AWS_REGION | ConvertFrom-Json
$ALB_ARN = $alb.LoadBalancers[0].LoadBalancerArn
$ALB_DNS = $alb.LoadBalancers[0].DNSName
Write-Output "✅ ALB DNS: $ALB_DNS"

# ------------------------------
# Step 6: Create HTTPS Listener
# ------------------------------
$listener = aws elbv2 create-listener `
    --load-balancer-arn $ALB_ARN `
    --protocol HTTPS `
    --port 443 `
    --certificates CertificateArn=$CERT_ARN `
    --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN `
    --region $AWS_REGION | ConvertFrom-Json

# ------------------------------
# Step 7: Register ECS Task Definition
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
            image = "$ECR_URI:latest"
            essential = $true
            portMappings = @(@{containerPort=8000; protocol="tcp"})
        }
    )
} | ConvertTo-Json -Depth 10
$taskDef | Out-File taskdef.json
aws ecs register-task-definition --cli-input-json file://taskdef.json --region $AWS_REGION
Write-Output "✅ ECS task definition registered: $TASK_NAME"

# ------------------------------
# Step 8: Create ECS Service (or update if exists)
# ------------------------------
try {
    $existingService = aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION | ConvertFrom-Json
    if ($existingService.services.Count -eq 0) {
        Write-Output "Creating ECS service $SERVICE_NAME..."
        aws ecs create-service `
            --cluster $CLUSTER_NAME `
            --service-name $SERVICE_NAME `
            --task-definition $TASK_NAME `
            --launch-type FARGATE `
            --desired-count 1 `
            --network-configuration "awsvpcConfiguration={subnets=[$($subnetArray -join ',' )],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" `
            --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=$CONTAINER_NAME,containerPort=8000" `
            --region $AWS_REGION
    } else {
        Write-Output "✅ ECS service exists. Updating service $SERVICE_NAME..."
        aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $TASK_NAME --region $AWS_REGION
    }
} catch {
    Write-Error "❌ ECS service creation/update failed."
    exit 1
}

# ------------------------------
# Step 9: Wait until service is stable
# ------------------------------
Write-Output "Waiting for ECS service to become stable..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION
Write-Output "✅ ECS service is now stable."

# ------------------------------
# Step 10: Determine Swagger URL & open browser
# ------------------------------
if ($DOMAIN_NAME -and (Test-NetConnection -ComputerName $DOMAIN_NAME -Port 443 -InformationLevel Quiet)) {
    $swaggerUrl = "https://$DOMAIN_NAME/api/docs"
} else {
    $swaggerUrl = "https://$ALB_DNS/api/docs"
}

Write-Output "✅ Deployment complete!"
Write-Output "Swagger UI: $swaggerUrl"
Start-Process $swaggerUrl
