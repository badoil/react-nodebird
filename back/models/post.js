module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    })
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);   // making userId on Post table autimatically
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as: 'Retweet' });  // making retweetId column on Post table automatically
        db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
        
    }
    return Post;
}