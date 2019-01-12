module GraphqlHelper
  def get_api(request)
    auth_header = request.headers["authorization"]
    if auth_header
      values = auth_header.split(' ')
      access_token = values.length == 2 && values.first == 'Bearer' ? values.last : nil
      koala = access_token ? Koala::Facebook::API.new(access_token) : nil
      return {access_token: access_token, koala: koala}
    else
      return {access_token: nil, koala: nil}
    end
  end
end
