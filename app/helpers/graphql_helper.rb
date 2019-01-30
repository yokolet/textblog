module GraphqlHelper
  def get_api(request, variables)
    access_token = get_access_token(request)
    social_api = get_social_api(access_token, variables)
    {access_token: access_token, social_api: social_api}
  end

  def self.ensure_social_api(ctx)
    access_token, social_api = ctx[:api][:access_token], ctx[:api][:social_api]
    if access_token.nil?
      raise StandardError.new('Authorization request header is missing.')
    end
    if social_api.nil?
      raise StandardError.new('Authorization request header is invalid.')
    end
    social_api
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
