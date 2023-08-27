import auth_config from "auth_config";

export const environment = {
    production : false,
    auth : {
        domain : auth_config.oidc.domain,
        clientId : auth_config.oidc.clientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
      }
    }
};