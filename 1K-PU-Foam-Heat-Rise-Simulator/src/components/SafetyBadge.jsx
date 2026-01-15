const SafetyBadge = ({ temperatureRise }) => {
  const getSafetyLevel = () => {
    if (temperatureRise < 30) {
      return { label: 'Low Risk', color: 'success', bgColor: 'bg-success/10', textColor: 'text-success', borderColor: 'border-success/20' }
    } else if (temperatureRise >= 30 && temperatureRise <= 50) {
      return { label: 'Moderate Risk', color: 'warning', bgColor: 'bg-warning/10', textColor: 'text-warning', borderColor: 'border-warning/20' }
    } else {
      return { label: 'High Risk', color: 'danger', bgColor: 'bg-danger/10', textColor: 'text-danger', borderColor: 'border-danger/20' }
    }
  }

  const safety = getSafetyLevel()

  return (
    <span className={`badge ${safety.bgColor} ${safety.textColor} border ${safety.borderColor}`}>
      {safety.label}
    </span>
  )
}

export default SafetyBadge