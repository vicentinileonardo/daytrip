module.exports = mongoose => {

  const Coordinates = mongoose.Schema({
    lat: Number,
    lon: Number
  });
  
  var schema = mongoose.Schema(
    {
      name: String,
      description: String,
      image_url: String,
      coordinates: Coordinates
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Destination = mongoose.model("destination", schema);
  return Destination;
};
