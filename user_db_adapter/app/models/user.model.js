module.exports = mongoose => {

  const Coordinates = mongoose.Schema({
    lat: Number,
    lon: Number
  });
  
  var schema = mongoose.Schema(
    {
      name: String,
      surname: String,
      email: String,
      password: String,
      status: {
        type: String,
        enum : ['STANDARD','ADMIN'],
        default: 'STANDARD'
      }, 
      origin_name: String,
      origin_coordinates: Coordinates
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
