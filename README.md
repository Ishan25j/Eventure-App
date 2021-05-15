# Eventure-App
---

Eventure is a WebApp created for selling tickets for various events (i.e. concerts, DJ parties, Sports event tickets and many more...) on online platform.


## Key feature of Eventure WebApp:

- It has Microservice architecture
- It runs in docker container which is maintained by kubernetes and skaffold
- Handles concurrency
- All microservices are hosted differently in docker container and it communicates with one another using async communication technique (event-bus)
- If certain services went down then also other services will be fully functional.
- Simple implemented search feature by their title

## Why to use Microservices Architecture?
Let's take example to understand it easily.
- Have you ever booked an indian railway ticket?
If yes, then you might have surely experience that servers are some times hangy (gets hangs) and slow down very frequently.

- So, why is it happening?
The main reason is, the Single Monolithic Server can't handle that much traffic at a time and need to add more servers at that movement which is some how hard.

- So, By keeping all this problem in mind. Eventure WebApp is been created using microservices architecture which can be scaled very easily using kubernetes.

## Tech Implemented:
- **FrontEnd:** 
  - next.js 
  - react 
  - bootstrap 
  - language used: javascript
- **BackEnd:** 
  - Language used: typescript
  - mongoose 
  - NATS streaming server as a event bus
  - Jest for testing
  - redis server for performing jobs and stripe for performing payments

## Documentation:

Documenation for this project can be found [here](./Docs/DOCUMENTATION.md)  

## Installation Info (locally):

### Requirement: 
**Docker, Kubernetes, and Skaffold should be installed and configured. (Also, required ingress-nginx installed for Windows and MacOS users and enabled in minikube for Ubuntu)**

- Clone the project and install it locally by using
  ```bash
  git clone https://github.com/Ishan25j/Eventure-App.git
  ```
- Go to every services folder (i.e auth, client, event-srv, expiration, orders, payment) and install required package using
  ```bash
  npm install
  ```

- After installing the required packages, try running test in auth, event-srv, orders and payment service by going to each folder and running
  ```bash
  npm run test
  ```
- Check and verify that each test passes and if you are facing any issue than try reinstalling and also verify that all package are available.

**Note:**
  Common folder is the submodule which orginally shared the common source code between each services which has been published on npm websites. Nothing that much important if you delete that submodule.

- After testing and installing package make you you have ingress-nginx enable on your system.
Now go to you host file
> In Windows: C:\Windows\System32\Drivers\etc\hosts
  In Linux\MacOS: \etc\hosts
  Edit it at the bottom add 127.0.0.1 eventure.dev
  and save it
- If you are using minikube then run `minikube ip`
And use that ip instead of 127.0.0.1 (i.e. minikube_ip eventure.dev)

So, this edit tries to run *eventure.dev* locally instead of finding it online via browser

Now after completing all the above steps and configuration, let's run the application.

## Running it locally:
- Now, you need to create three kubernetes secrets in order to run this. So just edit the three given commands values as per the requirement

- For JWT:
  ```bash
  kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<'JWT key you want to keep for auth'>
  ```

- For stripe private key:
  ```bash
  kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<'use private key given by stripe'>
  ```

- For stripe public key:
  ```bash
  kubectl create secret generic stripe-p-secret --from-literal=STRIPE_P_KEY=<'use public key given by stripe'>
  ```

- Now, just run 

  ```bash
  skaffold dev
  ```

and it will start the application.

## Resource link:

For get into [docker](https://www.docker.com/get-started).

For getting into [kubernetes](https://kubernetes.io/docs/tasks/tools/).

If you want to use [minikube](https://minikube.sigs.k8s.io/docs/start/).

For insatlling [skaffold](https://skaffold.dev/docs/quickstart/).

Get info about [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/) setup.

## Future Updates:

- [ ] Adding the functionality of buying multiple tickets at a time.
- [ ] Adding `socketIO` for creating realtime communication system.
- [ ] Adding the functionality of adding a custom image and background for individual event by the organizer.
- [ ] Adding credit system. (just like in steam app, for buying and selling tickets as at present after selling the ticket the buyer is getting nothing)
- [ ] Adding the various categories for the event
  
## Issues and Contribution:

- If you found bug or facing problem in something.
- If you got any new idea

then just raise an [issue]('https://github.com/Ishan25j/Eventure-App/issues') here.

If you want to contribute then, see [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
