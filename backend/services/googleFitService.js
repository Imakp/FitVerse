const { google } = require("googleapis");
const User = require("../models/user");

class GoogleFitService {
  constructor(user) {
    this.user = user;
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
    this.oauth2Client.setCredentials({
      access_token: user.googleTokens.accessToken,
      refresh_token: user.googleTokens.refreshToken,
    });
    this.fitness = google.fitness({ version: "v1", auth: this.oauth2Client });
  }

  async fetchStepsData(startTimeMillis, endTimeMillis) {
    try {
      const response = await this.fitness.users.dataset.aggregate({
        userId: "me",
        requestBody: {
          aggregateBy: [
            {
              dataTypeName: "com.google.step_count.delta",
            },
          ],
          bucketByTime: { durationMillis: 86400000 }, // Daily buckets
          startTimeMillis,
          endTimeMillis,
        },
      });

      return this._processStepsData(response.data);
    } catch (error) {
      console.error("Error fetching steps data:", error);
      throw error;
    }
  }

  async fetchHeartRateData(startTimeMillis, endTimeMillis) {
    try {
      const response = await this.fitness.users.dataset.aggregate({
        userId: "me",
        requestBody: {
          aggregateBy: [
            {
              dataTypeName: "com.google.heart_rate.bpm",
            },
          ],
          bucketByTime: { durationMillis: 86400000 }, // Daily buckets
          startTimeMillis,
          endTimeMillis,
        },
      });

      return this._processHeartRateData(response.data);
    } catch (error) {
      console.error("Error fetching heart rate data:", error);
      throw error;
    }
  }

  async fetchSleepData(startTimeMillis, endTimeMillis) {
    try {
      const response = await this.fitness.users.sessions.list({
        userId: "me",
        startTime: new Date(parseInt(startTimeMillis)).toISOString(),
        endTime: new Date(parseInt(endTimeMillis)).toISOString(),
        activityType: 72, // Sleep
      });

      return this._processSleepData(response.data);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
      throw error;
    }
  }

  _processStepsData(data) {
    return data.bucket.map((bucket) => ({
      date: new Date(parseInt(bucket.startTimeMillis)),
      count: bucket.dataset[0].point[0]?.value[0]?.intVal || 0,
    }));
  }

  _processHeartRateData(data) {
    return data.bucket.map((bucket) => {
      const points = bucket.dataset[0].point || [];
      const values = points.map((point) => point.value[0]?.fpVal || 0);
      const avgValue = values.length
        ? values.reduce((a, b) => a + b) / values.length
        : 0;

      return {
        date: new Date(parseInt(bucket.startTimeMillis)),
        value: Math.round(avgValue),
      };
    });
  }

  _processSleepData(data) {
    return data.session.map((session) => ({
      date: new Date(session.startTimeMillis),
      duration:
        (session.endTimeMillis - session.startTimeMillis) / (1000 * 60 * 60), // Convert to hours
      quality: this._getSleepQuality(session),
    }));
  }

  _getSleepQuality(session) {
    const durationHours =
      (session.endTimeMillis - session.startTimeMillis) / (1000 * 60 * 60);
    if (durationHours < 6) return "Poor";
    if (durationHours < 7) return "Fair";
    if (durationHours < 9) return "Good";
    return "Excellent";
  }

  static async syncUserFitnessData(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.googleTokens.accessToken) {
        throw new Error("User not found or not connected to Google Fit");
      }

      const service = new GoogleFitService(user);
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 7); // Last 7 days

      const [steps, heartRate, sleep] = await Promise.all([
        service.fetchStepsData(startTime.getTime(), endTime.getTime()),
        service.fetchHeartRateData(startTime.getTime(), endTime.getTime()),
        service.fetchSleepData(startTime.getTime(), endTime.getTime()),
      ]);

      user.fitnessData = {
        lastSync: new Date(),
        steps,
        heartRate,
        sleep,
      };

      await user.save();
      return user.fitnessData;
    } catch (error) {
      console.error("Error syncing fitness data:", error);
      throw error;
    }
  }
}

module.exports = GoogleFitService;
