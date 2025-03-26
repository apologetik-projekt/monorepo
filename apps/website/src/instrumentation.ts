export async function register() {
	try {
		if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
			const appInsights = await import('applicationinsights')
			appInsights
				.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
				.setAutoCollectConsole(true)
				.setAutoCollectDependencies(true)
				.setAutoCollectExceptions(true)
				.setAutoCollectHeartbeat(true)
				.setAutoCollectPerformance(true, true)
				.setAutoCollectRequests(true)
				.setAutoDependencyCorrelation(true)
				.setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
				.setSendLiveMetrics(true)
				.setUseDiskRetryCaching(true)
			appInsights.defaultClient.setAutoPopulateAzureProperties()
			appInsights.start()
		}
	} catch (e) {
		console.error('You tried to run application insight in an environment thats not supported')
	}
}
