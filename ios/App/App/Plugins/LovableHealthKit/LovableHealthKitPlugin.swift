// LovableHealthKitPlugin.swift
// Custom Capacitor plugin with extensive logging for HealthKit steps

import Foundation
import Capacitor
import HealthKit

@objc(LovableHealthKitPlugin)
public class LovableHealthKitPlugin: CAPPlugin {
    private let healthStore = HKHealthStore()
    private let loggerTag = "[LovableHealthKit][iOS]"

    @objc override public func load() {
        CAPLog.print("\(loggerTag) Plugin loaded and ready.")
        print("\(loggerTag) Plugin loaded and ready.")
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        CAPLog.print("\(loggerTag) Requesting HealthKit authorization...")
        print("\(loggerTag) Requesting HealthKit authorization...")

        guard HKHealthStore.isHealthDataAvailable() else {
            CAPLog.print("\(loggerTag) Health data not available on this device.")
            call.resolve(["granted": false])
            return
        }

        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            CAPLog.print("\(loggerTag) Failed to create stepCount type.")
            call.resolve(["granted": false])
            return
        }

        let readTypes: Set = [stepType]
        healthStore.requestAuthorization(toShare: nil, read: readTypes) { (granted, error) in
            if let error = error {
                CAPLog.print("\(self.loggerTag) Authorization error: \(error.localizedDescription)")
            }
            CAPLog.print("\(self.loggerTag) Authorization granted? \(granted)")
            call.resolve(["granted": granted])
        }
    }

    @objc func getStepCountLast7Days(_ call: CAPPluginCall) {
        CAPLog.print("\(loggerTag) Fetching last 7 days steps...")

        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount) else {
            CAPLog.print("\(loggerTag) Failed to create stepCount type.")
            call.reject("Step type not available")
            return
        }

        let calendar = Calendar.current
        let now = Date()
        guard let startDate = calendar.date(byAdding: .day, value: -6, to: calendar.startOfDay(for: now)) else {
            call.reject("Failed to compute start date")
            return
        }

        var interval = DateComponents()
        interval.day = 1

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: now, options: .strictStartDate)
        let query = HKStatisticsCollectionQuery(
            quantityType: stepType,
            quantitySamplePredicate: predicate,
            options: .cumulativeSum,
            anchorDate: startDate,
            intervalComponents: interval
        )

        query.initialResultsHandler = { _, results, error in
            if let error = error {
                CAPLog.print("\(self.loggerTag) Statistics query error: \(error.localizedDescription)")
                call.reject("Query error: \(error.localizedDescription)")
                return
            }

            var days: [[String: Any]] = []
            results?.enumerateStatistics(from: startDate, to: now) { stats, _ in
                let startOfDay = calendar.startOfDay(for: stats.startDate)
                let isoString = ISO8601DateFormatter().string(from: startOfDay)
                let count = stats.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                let steps = Int(count)
                days.append(["date": isoString, "steps": steps])
                CAPLog.print("\(self.loggerTag) Day: \(isoString) Steps: \(steps)")
            }

            CAPLog.print("\(self.loggerTag) Returning \(days.count) day entries.")
            call.resolve(["days": days])
        }

        healthStore.execute(query)
    }
}
