class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    callback_for(:facebook)
  end

  def failure
    redirect_to root_path
  end

  private
  def callback_for(provider)
    @user = User.from_omniauth(request.env["omniauth.auth"])
  end
end
