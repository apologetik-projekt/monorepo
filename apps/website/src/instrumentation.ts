export async function register() {
	try {
		require.resolve('@azure/functions-core')
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
	} catch (e) {
		//
	}
}
