module GraphqlHelper
  def get_api(request, variables)
    access_token = get_access_token(request)
    social_api = get_social_api(access_token, variables)
    {access_token: access_token, social_api: social_api}
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
