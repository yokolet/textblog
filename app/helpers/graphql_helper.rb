module GraphqlHelper
  def get_api(request, variables)
    # controller uses this method
    access_token = get_access_token(request)
    social_api = get_social_api(access_token, variables)
    {social_api: social_api, provider: variables[:provider]}
  end

  def self.ensure_social_api(ctx)
    # mutations use this method
    social_api = ctx[:api][:social_api]
    if social_api.nil?
      # this happens when GraphQL IDE is used
      # Authorization header is missing, or provider is not facebook
      raise GraphQL::ExecutionError.new("Sign In again", options: {type: "AuthHeaderError"})
    end
    social_api
  end

  def self.ensure_user(ctx)
    # mutations use this method
    social_api = self.ensure_social_api(ctx)
    begin
      me = social_api.get_object('me', {'fields': 'id'})
    rescue
      # The error message is really lengthy, full explanation. Cut down to a clear message here.
      raise GraphQL::ExecutionError.new("Sign In again", options: {type: "OAuthError"})
    end
    user = User.where(provider: ctx[:api][:provider], uid: me['id']).first
    if user.nil?
      # After the user signed in, the account was deleted before submit. Not likely, but may happen.
      raise GraphQL::ExecutionError.new("Sign In again", options: {type: "ParamError"})
    end
    user
  end

  def self.escape_angle_brackets(s)
    s.gsub('<', '&lt;').gsub('>', '&gt;')
  end

  private
  def get_access_token(request)
    auth_header = request.headers["authorization"]
    if auth_header
      values = auth_header.split(' ')
      values.length == 2 && values.first == 'Bearer' ? values.last : nil
    else
      nil
    end
  end

  def get_social_api(access_token, variables)
    if access_token.nil?
      return nil
    end
    if variables[:provider] == 'facebook'
      Koala::Facebook::API.new(access_token)
    else
      nil
    end
  end
end
