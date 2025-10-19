using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;

namespace MobiFlight.Base.Migration
{
    /// <summary>
    /// Migrates Precondition properties from V1 (long names) to V1.1 (short names)
    /// </summary>
    public static class Precondition_V_0_9_Migration
    {
        public static JObject Apply(JObject document)
        {
            var migrated = document.DeepClone() as JObject;

            MigratePreconditionProperties(migrated);
            RemoveEmptyPreconditions(migrated);

            return migrated;
        }

        private static List<JObject> FindPreconditionsInDocument(JObject document)
        {
            var preconditions = new List<JObject>();

            // Look in ConfigFiles -> ConfigItems -> Preconditions
            var configFiles = document["ConfigFiles"] as JArray;
            if (configFiles != null)
            {
                foreach (var configFile in configFiles)
                {
                    var configItems = configFile["ConfigItems"] as JArray;
                    if (configItems != null)
                    {
                        foreach (var configItem in configItems)
                        {
                            var itemPreconditions = configItem["Preconditions"] as JArray;
                            if (itemPreconditions != null)
                            {
                                preconditions.AddRange(itemPreconditions.OfType<JObject>());
                            }
                        }
                    }
                }
            }

            return preconditions;
        }

        private static void MigratePreconditionProperties(JObject document)
        {
            // Find all Precondition objects in the document
            var preconditions = FindPreconditionsInDocument(document);

            foreach (var precondition in preconditions)
            {
                var propertyMappings = new Dictionary<string, string>
                {
                    { "PreconditionType", "type" },
                    { "PreconditionRef", "ref" },
                    { "PreconditionSerial", "serial" },
                    { "PreconditionPin", "pin" },
                    { "PreconditionOperand", "operand" },
                    { "PreconditionValue", "value" },
                    { "PreconditionLogic", "logic" },
                    { "PreconditionActive", "active" }
                };

                foreach (var mapping in propertyMappings)
                {
                    if (precondition[mapping.Key] != null)
                    {
                        precondition[mapping.Value] = precondition[mapping.Key];
                        precondition.Remove(mapping.Key);
                    }
                }
            }

            if (preconditions.Count > 0)
            {
                Log.Instance.log($"Migrated {preconditions.Count} preconditions from V1 to V1.1 format", LogSeverity.Debug);
            }
        }

        private static void RemoveEmptyPreconditions(JObject document)
        {
            int totalRemoved = 0;

            // Traverse the document structure directly to work with actual JArrays
            var configFiles = document["ConfigFiles"] as JArray;
            if (configFiles != null)
            {
                foreach (var configFile in configFiles)
                {
                    var configItems = configFile["ConfigItems"] as JArray;
                    if (configItems != null)
                    {
                        foreach (var configItem in configItems)
                        {
                            var itemPreconditions = configItem["Preconditions"] as JArray;
                            if (itemPreconditions != null)
                            {
                                // Find preconditions with type "none" to remove
                                var preconditionsToRemove = itemPreconditions
                                    .OfType<JObject>()
                                    .Where(p => p["type"] == null || p["type"]?.ToString() == "none")
                                    .ToList();

                                // Remove them from the actual document JArray
                                foreach (var preconditionToRemove in preconditionsToRemove)
                                {
                                    itemPreconditions.Remove(preconditionToRemove);
                                    totalRemoved++;
                                }
                            }
                        }
                    }
                }
            }

            if (totalRemoved > 0)
            {
                Log.Instance.log($"Removed {totalRemoved} empty preconditions (type='none') during migration", LogSeverity.Debug);
            }
        }
    }
}