# Eventure-App
---
Eventure App is create for selling tickets online for various events. So basically the events is created having limited ticket available and also the price is given.
As, we all know that there is huge traffic in buying and selling ticket online and we need a better system for managing various events and also the concurreny and the systme need to be scalable.

So, keeping this idea in mind, this app is created using microservices having total 6 services which can be scaled easily.

## Tech Implemented:
- FrontEnd: next.js, react, bootstrap and using javascript
- backend: fully typescript, mongoose, NATS streaming server as a event bus, Jest for testing, redis server for performing jobs and stripe for performing payments

## Installation Info (locally):

### Requirement: 
**Docker, Kubernetes, and Skaffold should be installed and configured. (Also reaquired ingress-nginx for Windows and MacOS users)**

Clone the project and install it locally by using
```bash
git clone https://github.com/Ishan25j/Eventure-App.git
```
Go to every services folder (i.e auth, client, event-srv, expiration, orders, payment) and install required package using
```bash
npm install
```

After installing the required package try running test in auth, event-srv, orders and payment service by going to each folder and running
```bash
npm run test
```
Check and verify that each test passes and if you are facing any issue than try reinstalling and verify thet all package are available.

### Common folder:
**Small Note: **
- So common folder is the submodule which orginally shared the common source which is been published on npm websites. Nothing that much important if you delete that submodule as it is already published and hosted on npm

- After testing and installing package make you you have ingress-nginx enable on your system.
Now go to you host file
In Windows: C:\Windows\System32\Drivers\etc\hosts
In Linux\MacOS: \etc\hosts
Edit it at the bottom add 127.0.0.1 eventure.dev
and save it
- If you are using minikube then run `minikube ip`
And use that ip instead of 127.0.0.1 (i.e. minikube_ip eventure.dev)
So, this tries to run eventure.dev locally instead of finding it online on browser

Now after completing all steps and configuration let's run the application.

## Running it locally:
Now you need to create three kubernetes secrets in order to run this. So just edit the three givn commands values as per the requirement

For JWT:
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

For stripe private key:
```bash
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<use private key given by stripe>
```

For stripe public key:
```bash
kubectl create secret generic stripe-p-secret --from-literal=STRIPE_P_KEY=<use private key given by stripe>
```

Now this just run 

```bash
skaffold dev
```

and it will start the application.

## Resource link:

For [docker](https://www.docker.com/get-started)

For [kubernetes](https://kubernetes.io/docs/tasks/tools/)

If you want to use [minikube](https://minikube.sigs.k8s.io/docs/start/)

For [skaffold](https://skaffold.dev/docs/quickstart/)

For [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/) setup.