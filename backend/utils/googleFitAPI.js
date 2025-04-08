const { google } = require('googleapis');

// Setup OAuth2 client
const createOAuth2Client = (tokens) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
};

// Calculate time range based on the selected range
const getTimeRange = (range) => {
  const endTime = new Date();
  const startTime = new Date();
  
  switch (range) {
    case 'week':
      startTime.setDate(startTime.getDate() - 7);
      break;
    case 'month':
      startTime.setMonth(startTime.getMonth() - 1);
      break;
    case 'year':
      startTime.setFullYear(startTime.getFullYear() - 1);
      break;
    default:
      startTime.setDate(startTime.getDate() - 7);
  }
  
  return {
    startTimeMillis: startTime.getTime(),
    endTimeMillis: endTime.getTime()
  };
};

// Fetch steps data
const fetchStepsData = async (auth, startTimeMillis, endTimeMillis) => {
  const fitness = google.fitness({ version: 'v1', auth });
  
  const res = await fitness.users.dataset.aggregate({
    userId: 'me',
    requestBody: {
      aggregateBy: [{
        dataTypeName: 'com.google.step_count.delta',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
      }],
      bucketByTime: { durationMillis: 86400000 }, // Daily buckets
      startTimeMillis,
      endTimeMillis
    }
  });
  
  // Process the response
  const stepsData = res.data.bucket.map(bucket => {
    const startDate = new Date(parseInt(bucket.startTimeMillis));
    let stepsCount = 0;
    
    if (bucket.dataset && bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
      stepsCount = bucket.dataset[0].point[0].value[0].intVal || 0;
    }
    
    return {
      date: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
      count: stepsCount
    };
  });
  
  return stepsData;
};

// Fetch heart rate data
const fetchHeartRateData = async (auth, startTimeMillis, endTimeMillis) => {
  const fitness = google.fitness({ version: 'v1', auth });
  
  try {
    const res = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.heart_rate.bpm',
          dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
        }],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis
      }
    });
    
    // Process the response
    const heartRateData = res.data.bucket.map(bucket => {
      const startDate = new Date(parseInt(bucket.startTimeMillis));
      let value = 0;
      
      if (bucket.dataset && bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
        // For heart rate, we'll use the average if available
        const points = bucket.dataset[0].point;
        let sum = 0;
        let count = 0;
        
        points.forEach(point => {
          if (point.value && point.value[0] && point.value[0].fpVal) {
            sum += point.value[0].fpVal;
            count++;
          }
        });
        
        value = count > 0 ? Math.round(sum / count) : 0;
      }
      
      return {
        date: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        value
      };
    }).filter(item => item.value > 0); // Filter out days with no heart rate data
    
    return heartRateData;
  } catch (error) {
    console.error('Error fetching heart rate data:', error);
    return []; // Return empty array if heart rate data is not available
  }
};

// Calculate summary statistics
const calculateSummary = (stepsData, heartRateData) => {
  // Calculate steps summary
  const totalSteps = stepsData.reduce((sum, day) => sum + day.count, 0);
  const averageSteps = stepsData.length > 0 ? totalSteps / stepsData.length : 0;
  const maxSteps = stepsData.length > 0 ? Math.max(...stepsData.map(day => day.count)) : 0;
  
  // Calculate heart rate summary if available
  let averageHeartRate = 0;
  let maxHeartRate = 0;
  let minHeartRate = 0;
  
  if (heartRateData && heartRateData.length > 0) {
    const heartRates = heartRateData.map(day => day.value).filter(val => val > 0);
    const totalHeartRate = heartRates.reduce((sum, rate) => sum + rate, 0);
    averageHeartRate = heartRates.length > 0 ? totalHeartRate / heartRates.length : 0;
    maxHeartRate = heartRates.length > 0 ? Math.max(...heartRates) : 0;
    minHeartRate = heartRates.length > 0 ? Math.min(...heartRates) : 0;
  }
  
  return {
    totalSteps,
    averageSteps,
    maxSteps,
    averageHeartRate,
    maxHeartRate,
    minHeartRate
  };
};

// Main function to fetch fitness data
const fetchFitnessData = async (tokens, range) => {
  try {
    const auth = createOAuth2Client(tokens);
    const { startTimeMillis, endTimeMillis } = getTimeRange(range);
    
    // Fetch steps data
    const stepsData = await fetchStepsData(auth, startTimeMillis, endTimeMillis);
    
    // Fetch heart rate data
    const heartRateData = await fetchHeartRateData(auth, startTimeMillis, endTimeMillis);
    
    // Calculate summary statistics
    const summary = calculateSummary(stepsData, heartRateData);
    
    return summary; // Return the summary
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    return null; // Return null in case of error
  }
};

