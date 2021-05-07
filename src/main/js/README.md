# YKI-Frontend

Web client for National Certificates of Language Proficiency service (Yleisten Kielitutkintojen Ilmottautumisjärjestelmä).

## Getting Started

```bash
npm install       # install dependencies
npm start         # start the development server on localhost:3000
npm test          # run the Jest test suite
npm run build     # create an optimized production build
```

## Project Structure

```bash
src
├── assets        # Logo, images etc.
├── components    # Stateless (functional) components
├── containers    # Stateful components
└── hoc           # Higher-Order Components
```

## Proxying in development

By default, API requests are directed to "proxy" address found in package.json. Some of the requests require this default proxy address to stay in place. 
It is possible to configure mockup response to each individual request in src/main/js/src/setupProxy.js.

When you want to use a local backend, you can configure local environment variables for this. Create a file in src/main/js/src/.env.local and add following lines:

```
REACT_APP_USE_LOCAL_PROXY_BACKEND=true
REACT_APP_LOCAL_PROXY=http://localhost:8080
```

Local proxy uri should match local yki backend server address. Be aware that this will require configuration in the backend aswell.

To use local backend, request needs to be configured to use one of the proxy call protocols in setupProxy.js.
Under is an example of a post request, which returns a mockup success response, but directs to local backend when env variables from above are found:

```
  app.post('/yki/api/registration/:id/submit', (req, res) => {
    
	const mockCall = () => {
      try {
        res.send({ success: true });
      } catch (err) {
        printError(req, err);
        res.status(404).send(err.message);
      }
    }
	
    useLocalProxy
      ? proxyPostCall(req, res)
      : mockCall();
  });

```

Read more about proxying API requests in development from [React's documentation](https://create-react-app.dev/docs/proxying-api-requests-in-development/).


## E2E Tests

[Cypress](https://docs.cypress.io/) is used for end to end testing.

Open Cypress Test Runner.
```bash
npm run cypress:open
```

Run all tests headlessly in the Electron browser.
```bash
npm run cypress:run
```

### License

YKI is licensed under the [EUPL](./LICENSE).
