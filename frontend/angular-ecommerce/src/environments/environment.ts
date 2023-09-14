import auth_config from "auth_config";

export const environment = {
    production : false,
    auth : {
        domain : auth_config.oidc.domain,
        clientId : auth_config.oidc.clientId,
        authorizationParams: {
          audience: auth_config.oidc.audience,
          redirect_uri: window.location.origin,
      }
    }
};