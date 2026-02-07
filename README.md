# Kubernetes Big Project 🚀

Et større Kubernetes-prosjekt som demonstrerer:

* Node.js / JavaScript API-applikasjon
* Docker containerisering og Docker Hub push
* Kubernetes manifests (ConfigMap, Secret, Deployment, Service)
* Kustomize base + overlays (dev / prod)
* GitOps med Argo CD lokalt
* (Senere) Observability med Prometheus + Grafana

Prosjektet er laget for å vise helhetlig forståelse av moderne DevOps-flyt.

---

## Arkitektur

```
Node.js App → Docker Image → Docker Hub → Kubernetes (Docker Desktop)
                                     ↓
                                  Argo CD
                                     ↓
                                  GitHub Repo
```

---

## Teknologier

* Node.js (Express)
* Docker
* Kubernetes (Docker Desktop Cluster)
* Kustomize
* Argo CD
* GitHub

---

## Prosjektstruktur

```
k8s-big-project/
  app/                  # Node.js app + Dockerfile
  k8s/
    base/               # Felles manifests
    overlays/
      dev/              # Dev miljø
      prod/             # Prod miljø
  argocd/               # ArgoCD Application YAMLs
  README.md
```

---

## 1. Node.js Applikasjon

Appen er en enkel REST API med:

* CRUD for todos
* `/healthz` og `/readyz` endpoints
* `/metrics` endpoint (enkelt foreløpig)
* Miljøvariabler:

  * `APP_NAME`
  * `LOG_LEVEL`
  * `API_KEY`

---

## 2. Docker

### Bygg image

```bash
docker build -t <dockerhub-username>/k8s-big-app:0.1.0 ./app
```

### Kjør lokalt

```bash
docker run -p 3000:3000 \
  -e APP_NAME="k8s-big-app" \
  -e LOG_LEVEL="debug" \
  -e API_KEY="dev-secret" \
  <dockerhub-username>/k8s-big-app:0.1.0
```

### Push til Docker Hub

```bash
docker login
docker push <dockerhub-username>/k8s-big-app:0.1.0
```

---

## 3. Kubernetes (Docker Desktop)

Sjekk cluster:

```bash
kubectl config current-context
kubectl get nodes
```

Deploy dev-miljø:

```bash
kubectl apply -k k8s/overlays/dev
```

Port-forward:

```bash
kubectl -n k8s-big port-forward svc/k8s-big-app-dev 8080:80
```

Test:

```bash
curl localhost:8080/
curl localhost:8080/healthz
curl localhost:8080/metrics
```

---

## 4. Kustomize Overlays

### Base

Inneholder:

* Namespace
* ConfigMap
* Secret
* Deployment
* Service

### Dev Overlay

* 1 replica
* Debug logging
* Egnet for lokal testing

### Prod Overlay

* 3 replicas
* Ressursgrenser
* Info logging

---

## 5. Argo CD (GitOps)

### Installer Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Port-forward UI

```bash
kubectl -n argocd port-forward svc/argocd-server 8081:443
```

Åpne:

```
https://localhost:8081
```

### Hent admin-passord

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
-o jsonpath="{.data.password}" | base64 --decode
```

---

## 6. GitHub Push

```bash
git init
git add .
git commit -m "Initial Kubernetes project"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

---

## 7. ArgoCD Application

ArgoCD peker på:

```
k8s/overlays/dev
k8s/overlays/prod
```

Automatisk sync er aktivert:

* Self-heal
* Prune
* Auto-deploy ved commit

---

## Sikkerhet (Demo-nivå)

* Secrets ligger i Git kun for demo.
* I produksjon bør man bruke:

  * Sealed Secrets
  * SOPS
  * External Secrets

---

## Neste Steg (Planlagt)

* Prometheus
* Grafana
* Ingress
* Horizontal Pod Autoscaler
* CI/CD pipeline for automatisk Docker build & tag update

---

## Mål med Prosjektet

* Vise forståelse for containerisering
* Vise Kubernetes manifeststruktur
* Demonstrere Kustomize overlays
* GitOps-workflow med Argo CD
* Lokal cluster drift
* Forberedelse for observability og autoskalering

---

Dette prosjektet er ment som et komplett DevOps-case som kan utvides videre.
