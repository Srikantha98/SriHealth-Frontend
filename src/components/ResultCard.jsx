export default function ResultCard({ result }) {
  // If no prediction yet
  if (!result) {
    return (
      <div className="text-slate-500 text-sm">
        No prediction available. Please upload an MRI image.
      </div>
    );
  }

  // Extract class and confidence, with fallbacks
  const stage = result.class || "Unknown";
  const confidence = result.confidence ?? null;

  // Determine confidence color, fallback to gray if missing
  const confidenceColor =
    confidence === null
      ? "text-slate-500"
      : confidence >= 85
      ? "text-green-600"
      : confidence >= 70
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="space-y-4">
      {/* Prediction Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border shadow-sm">
        <h4 className="text-lg font-semibold mb-2">Prediction Outcome</h4>

        <p className="text-slate-700">
          <span className="font-medium">Alzheimer’s Stage:</span>{" "}
          <span className="font-semibold">{stage}</span>
        </p>

        {confidence !== null && (
          <p className="text-slate-700">
            <span className="font-medium">Confidence Score:</span>{" "}
            <span className={`font-semibold ${confidenceColor}`}>
              {confidence.toFixed(1)}%
            </span>
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-slate-500 leading-relaxed">
        <p>
          *The prediction is generated using a GAN-augmented deep learning
          framework and is intended for academic and research purposes only.
        </p>
      </div>
    </div>
  );
}
