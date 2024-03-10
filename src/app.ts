import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());

app.use(morgan("dev"));

// importing routes
import userRoute from "./routes/user.routes";
import artistRoute from "./routes/artist.routes";
import songRoute from "./routes/song.routes";
import likedSongRoute from "./routes/likedSongs.routes";
import playlistRoute from "./routes/playlist.routes";

// using routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/artists", artistRoute);
app.use("/api/v1/songs", songRoute);
app.use("/api/v1/like-songs", likedSongRoute);
app.use("/api/v1/songs/playlist", playlistRoute);

app.use(errorMiddleware);

export default app;
