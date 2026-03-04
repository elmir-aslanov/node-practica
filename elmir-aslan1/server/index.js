const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();
const port = 8080;

app.use(express.json());

const movieValidator = (req, res, next) => {
  const { title, language, duration } = req.body;
  if (!title || !language || !duration) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }
  next();
};


const DB_URL =
  "mongodb+srv://salam:salam123@cluster0.vkrt1nv.mongodb.net/Moviesapp";

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const MovieModel = mongoose.model("Movie", MovieSchema);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.post('/api/movies', async (req, res) => {
//   try {
//     const movie = await MovieModel.create(req.body)
//     res.status(201).json({
//       success: true,
//       data: movie,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// })

app.get("/api/movies", async (req, res) => {
  try {
    const movies = await MovieModel.find({});
    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// app.put('/api/movies/:id', async (req, res) => {
//   try {
//     const updatedMovie = await MovieModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     )

//     if (!updatedMovie) {
//       return res.status(404).json({
//         success: false,
//         message: 'Movie not found',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: updatedMovie,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// })

app.delete("/api/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await MovieModel.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
      data: deletedMovie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// craete
app.post("/api/movies", movieValidator, async (req, res) => {
  try {
    const newBook = new MovieModel({
      ...req.body,
    });
    await newBook.save();

    res.status(201).json({
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

//uptade

app.put("/api/movies/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, language, duration } = req.body;

    if (!title || !language || !duration) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const updatedMovie = await MovieModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { returnDocument: "after" }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        message: "Movie not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, link: http://localhost:8080`
  );
});

