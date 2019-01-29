class ChangePosts < ActiveRecord::Migration[5.2]
  def change
    change_column :posts, :title, :string, null: false, limit: 50
    change_column :posts, :content, :text, null: false
  end
end
