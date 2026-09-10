import React from "react"
function FeatureList({ features }) {
  return (
    <ul className="feature-list">
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}

export default FeatureList;

