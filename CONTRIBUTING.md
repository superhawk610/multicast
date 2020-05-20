## PRE-RELEASE

This branch is in an **unstable**, **pre-release** state. Use at your own risk. You've been warned.

## Developing Locally

Multicast's client/server model accomodates two different setups:

- running in production, in which the user is expected to access the `client` app via the `server` (this
  allows for neat stuff like variable injection)
- running in development, in which the user accesses the `client` app at a different port than the `server`

To get a minimal setup running, make sure to follow the **Setup** and **Server Configuration** sections in
the main [README](README) first. Once you've done that, open two terminal windows/tabs, one for the `client` and one for the `server`. In the first, do:

```
cd client
yarn start
```

This will start the client at [http://localhost:1234](http://localhost:1234). In the second, do:

```
cd server
yarn start
```

This will start the server on port `4000` (by default) and make the GraphQL playground available at
[http://localhost:4000/playground](http://localhost:4000/playground).
