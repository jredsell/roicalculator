export function calculateResults(useCases, globalSettings) {
  let totalUnitsRequired = 0;
  let totalTimeSavedMinutes = 0;
  let totalCurrentAgentCostMonthly = 0; // Cost of humans doing this work (the time saved portion)
  let totalFteSaved = 0;

  let totalOriginalEngagedMinutes = 0;
  let totalRemainingHumanMinutes = 0;

  let totalSpeechMinutes = 0;
  let totalDigitalMessages = 0;

  // Working hours calculations
  // 37.5 hours/week * 52 weeks / 12 months = average monthly hours per FTE
  const monthlyHoursPerFte = ((globalSettings.fteWeeklyHours || 0) * 52) / 12;
  const monthlyMinutesPerFte = monthlyHoursPerFte * 60;

  useCases.forEach(uc => {
    const engagedInteractions = (uc.totalInteractions || 0) * ((uc.engagementRate || 0) / 100);
    const fullyResolvedInteractions = engagedInteractions * ((uc.resolutionRate || 0) / 100);
    const handedOverInteractions = engagedInteractions - fullyResolvedInteractions;

    // Units for this use case
    totalUnitsRequired += engagedInteractions * (uc.unitsPerInteraction || 0);

    // Calculate Speech / Digital Messages
    if (uc.channel === 'Voice') {
      totalSpeechMinutes += engagedInteractions * (uc.aiTalkTime || 0);
    } else if (uc.channel === 'Digital') {
      totalDigitalMessages += engagedInteractions * (uc.digitalMessagesPerInteraction || 0);
    }

    // Time saved (minutes) per month
    let timeSaved = 0;
    if (uc.category === 'Triage') {
      const transferredInteractions = engagedInteractions * ((uc.transferRate || 0) / 100);
      timeSaved = transferredInteractions * (uc.transferTime || 0);
      
      totalOriginalEngagedMinutes += timeSaved;
      totalRemainingHumanMinutes += 0;
    } else {
      const fullTimeSaved = fullyResolvedInteractions * (uc.actualHandlingTime || 0);
      const partialTimeSaved = handedOverInteractions * (uc.handoverTimeSaved || 0);
      timeSaved = fullTimeSaved + partialTimeSaved;
      
      const originalMinutes = engagedInteractions * (uc.actualHandlingTime || 0);
      const remainingMinutes = originalMinutes - timeSaved;
      
      totalOriginalEngagedMinutes += originalMinutes;
      totalRemainingHumanMinutes += remainingMinutes;
    }
    totalTimeSavedMinutes += timeSaved;

    // FTEs saved for this use case
    const fteSaved = monthlyMinutesPerFte > 0 ? (timeSaved / monthlyMinutesPerFte) : 0;
    totalFteSaved += fteSaved;

    // Annual cost / 12 = monthly cost per FTE
    const monthlyFteCost = (globalSettings.fullyLoadedAgentCost || 0) / 12;
    totalCurrentAgentCostMonthly += fteSaved * monthlyFteCost;
  });

  const originalEngagedFte = monthlyMinutesPerFte > 0 ? (totalOriginalEngagedMinutes / monthlyMinutesPerFte) : 0;
  const remainingHumanFte = monthlyMinutesPerFte > 0 ? (totalRemainingHumanMinutes / monthlyMinutesPerFte) : 0;
  
  const monthlyFteCost = (globalSettings.fullyLoadedAgentCost || 0) / 12;
  const totalOriginalEngagedCostMonthly = originalEngagedFte * monthlyFteCost;
  const totalRemainingHumanCostMonthly = remainingHumanFte * monthlyFteCost;

  // Global AI Costs
  const totalIncludedUnits = (globalSettings.numberOfAgents || 0) * (globalSettings.includedAiUnits || 0);
  const baseAiMonthlyCost = (globalSettings.numberOfAgents || 0) * ((globalSettings.aiEnablementCost || 0) + (globalSettings.agentLicenseCost || 0));

  // Additional Bundles needed
  const extraUnitsNeeded = Math.max(0, totalUnitsRequired - totalIncludedUnits);
  const bundleSize = globalSettings.additionalBundleSize || 1;
  const bundlesNeeded = Math.ceil(extraUnitsNeeded / bundleSize);
  const additionalBundlesCost = bundlesNeeded * (globalSettings.additionalBundleCost || 0);

  // Speech Cost (Purchased in blocks of 100 hours)
  const totalSpeechHours = totalSpeechMinutes / 60;
  const speechBlocksNeeded = Math.ceil(totalSpeechHours / 100);
  const speechCost = speechBlocksNeeded * (globalSettings.speechCostPer100Hours || 0);

  // Digital Messages Cost
  const totalIncludedDigitalMessages = (globalSettings.numberOfAgents || 0) * (globalSettings.includedDigitalMessages || 0);
  const extraDigitalMessagesNeeded = Math.max(0, totalDigitalMessages - totalIncludedDigitalMessages);
  const digitalBundleSize = globalSettings.additionalDigitalBundleSize || 1;
  const digitalBundlesNeeded = Math.ceil(extraDigitalMessagesNeeded / digitalBundleSize);
  const additionalDigitalBundlesCost = digitalBundlesNeeded * (globalSettings.additionalDigitalBundleCost || 0);

  const totalAiMonthlyCost = baseAiMonthlyCost + additionalBundlesCost + speechCost + additionalDigitalBundlesCost;

  // Base software cost without AI (just the agent licenses)
  const baseSoftwareCost = (globalSettings.numberOfAgents || 0) * (globalSettings.agentLicenseCost || 0);

  // Total Savings (Cost avoided by automating - Cost of AI software + Cost of Base Software)
  // Actually, saving is: Human Cost Avoided - (Total AI Software Cost - Base Software Cost)
  const incrementalAiCost = totalAiMonthlyCost - baseSoftwareCost;
  const netMonthlySavings = totalCurrentAgentCostMonthly - incrementalAiCost;
  const netYearlySavings = netMonthlySavings * 12;
  const roiPercentage = incrementalAiCost > 0 ? (netMonthlySavings / incrementalAiCost) * 100 : (netMonthlySavings > 0 ? 100 : 0);
  const paybackMonths = totalCurrentAgentCostMonthly > 0 ? (incrementalAiCost * 12) / totalCurrentAgentCostMonthly : 0;

  return {
    totalUnitsRequired,
    totalIncludedUnits,
    extraUnitsNeeded,
    bundlesNeeded,
    additionalBundlesCost,
    totalSpeechHours,
    totalSpeechMinutes,
    speechCost,
    totalDigitalMessages,
    totalIncludedDigitalMessages,
    extraDigitalMessagesNeeded,
    digitalBundlesNeeded,
    additionalDigitalBundlesCost,
    totalAiMonthlyCost,
    incrementalAiCost,
    baseSoftwareCost,
    totalTimeSavedMinutes,
    totalTimeSavedHours: totalTimeSavedMinutes / 60,
    totalFteSaved,
    totalCurrentAgentCostMonthly,
    totalOriginalEngagedCostMonthly,
    totalRemainingHumanCostMonthly,
    netMonthlySavings,
    netYearlySavings,
    roiPercentage,
    paybackMonths
  };
}
