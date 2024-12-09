export interface IPaypalOAtuhTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface IPaypalCreateOrderResponse {
  id: string;
  status: string;
  links: Link[];
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}
