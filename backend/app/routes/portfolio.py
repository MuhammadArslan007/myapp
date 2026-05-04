from fastapi import APIRouter

router = APIRouter(tags=["Portfolio"])


@router.get("/profile")
def profile():
    return {
        "name": "Muhammad Arslan",
        "role": "DevOps Engineer",
        "learning": "PSEB DevOps Program",
        "instructor": "Asad Muhammad",
        "bio": "Passionate DevOps engineer skilled in CI/CD, cloud infrastructure, and automation.",
        "location": "Pakistan",
        "github": "https://github.com/arslan",
        "linkedin": "https://linkedin.com/in/arslan",
        "skills": ["Azure", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Linux", "Python"]
    }


@router.get("/certifications")
def certifications():
    return [
        {
            "id": 1,
            "name": "AZ-104",
            "type": "Microsoft Azure Administrator",
            "issuer": "Microsoft",
            "status": "Completed",
            "badge_color": "#0078D4"
        },
        {
            "id": 2,
            "name": "AZ-400",
            "type": "Microsoft Azure DevOps Engineer Expert",
            "issuer": "Microsoft",
            "status": "In Progress",
            "badge_color": "#00BCF2"
        }
    ]


@router.get("/services")
def services():
    return [
        {
            "id": 1,
            "title": "CI/CD Pipeline Setup",
            "description": "Design and implement automated CI/CD pipelines using GitHub Actions, Jenkins, or Azure DevOps.",
            "icon": "pipeline"
        },
        {
            "id": 2,
            "title": "Cloud Infrastructure",
            "description": "Provision and manage Azure cloud resources using Terraform and ARM templates.",
            "icon": "cloud"
        },
        {
            "id": 3,
            "title": "Containerization",
            "description": "Dockerize applications and orchestrate with Kubernetes for scalable deployments.",
            "icon": "container"
        },
        {
            "id": 4,
            "title": "Monitoring & Logging",
            "description": "Set up monitoring with Azure Monitor, Prometheus, and Grafana dashboards.",
            "icon": "monitor"
        }
    ]


@router.get("/blog")
def blog():
    return [
        {
            "id": 1,
            "title": "Getting Started with Azure DevOps",
            "summary": "A beginner's guide to setting up your first Azure DevOps pipeline.",
            "date": "2026-04-01",
            "tags": ["Azure", "CI/CD", "DevOps"]
        },
        {
            "id": 2,
            "title": "Docker for DevOps Engineers",
            "summary": "How to containerize your applications and streamline deployments.",
            "date": "2026-04-15",
            "tags": ["Docker", "Containers", "DevOps"]
        },
        {
            "id": 3,
            "title": "AZ-104 Study Guide",
            "summary": "Key topics and resources for passing the Azure Administrator exam.",
            "date": "2026-04-20",
            "tags": ["Azure", "Certification", "AZ-104"]
        }
    ]
