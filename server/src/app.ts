import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import schedule from "node-schedule"; // TODO: Keep only if scheduling cronjobs

import { articleTagsRouter } from "../routes/article_tags";
import { articlesRouter } from "../routes/articles";
import { classEnrollmentsRouter } from "../routes/class_enrollments";
import { classTagsRouter } from "../routes/class_tags";
import { classVideosRouter } from "../routes/class_videos";
import { classesRouter } from "../routes/classes";
import { classesTaughtRouter } from "../routes/classes_taught";
import { corequisitesRouter } from "../routes/corequisites";
import { eventEnrollmentRouter } from "../routes/event_enrollments";
import { eventTagsRouter } from "../routes/event_tags";
import { eventsRouter } from "../routes/events";
import emailRouter from "../routes/nodeMailer";
import { reviewsRouter } from "../routes/reviews";
import { s3Router } from "../routes/s3";
import { scheduledClassesRouter } from "../routes/scheduled_classes";
import { studentsRouter } from "../routes/students";
import { tagsRouter } from "../routes/tags";
import { teachersRouter } from "../routes/teachers";
import { usersRouter } from "../routes/users";
import { videoTagsRouter } from "../routes/video_tags";
import { verifyToken } from "./middleware";

dotenv.config();

schedule.scheduleJob("0 0 0 0 0", () => console.info("Hello Cron Job!")); // TODO: delete sample cronjob

const CLIENT_HOSTNAME =
  process.env.NODE_ENV === "development"
    ? `${process.env.DEV_CLIENT_HOSTNAME}:${process.env.DEV_CLIENT_PORT}`
    : process.env.PROD_CLIENT_HOSTNAME;

const SERVER_PORT =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_SERVER_PORT
    : process.env.PROD_SERVER_PORT;

const app = express();
app.use(
  cors({
    origin: CLIENT_HOSTNAME,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(verifyToken);
}

app.use("/classes", classesRouter);
app.use("/scheduled-classes", scheduledClassesRouter);
app.use("/classes-videos", classVideosRouter);
app.use("/users", usersRouter);
app.use("/students", studentsRouter);
app.use("/events", eventsRouter);
app.use("/classes-taught", classesTaughtRouter);
app.use("/class-enrollments", classEnrollmentsRouter);
app.use("/teachers", teachersRouter);
app.use("/reviews", reviewsRouter);
// connecting made router with the app
app.use("/articles", articlesRouter);
app.use("/event-enrollments", eventEnrollmentRouter);
app.use("/nodemailer", emailRouter);
app.use("/s3", s3Router);
app.use("/article-tags", articleTagsRouter);
app.use("/class-tags", classTagsRouter);
app.use("/event-tags", eventTagsRouter);
app.use("/video-tags", videoTagsRouter);
app.use("/tags", tagsRouter);
app.use("/corequisites", corequisitesRouter);
app.listen(SERVER_PORT, () => {
  console.info(`Server listening on ${SERVER_PORT}`);
});
