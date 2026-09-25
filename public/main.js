const LoadPerUnit = [
    0,
    108, // T1
    124,
    142,
    164,
    188,
    217,
    249,
    287,
    330, // T9
    379, // T10
    400. // T11
];

const BlueHeroBonus = [
    0,    // no blue hero
    0.05, // skill level 0
    0.10,
    0.15,
    0.20,
    0.25  // skill level 5
];

function getNumber(formId) {
    const n = Number.parseInt(
        document.getElementById(formId).value,
        10
    );
    return Number.isNaN(n) ? 0 : n;
}

function calcReturnTime(event) {
    // event.preventDefault();

    const Troops = getNumber("ksUnitsInf") + getNumber("ksUnitsCav") + getNumber("ksUnitsArc");
    const BlueBonus = BlueHeroBonus[getNumber("ksBlueHero")];
    const GatheringSpeed = 1 + getNumber("ksGatheringBonus")/100 + BlueBonus;
    const GatheringAmount = Troops * LoadPerUnit[9];
    const StandardGatheringTimeInSeconds = GatheringAmount / 118.8;
    const GatheringTimeInSeconds = StandardGatheringTimeInSeconds / GatheringSpeed;

    const TravelTimeInSeconds = getNumber("ksTimeToDestinationMinutes") * 60 + getNumber("ksTimeToDestinationSeconds");

    const tmpSeconds = (TravelTimeInSeconds + GatheringTimeInSeconds) % 60;
    const TotalTimeInMinutes = ((TravelTimeInSeconds + GatheringTimeInSeconds) - tmpSeconds) / 60;
    const tmpMinutes = TotalTimeInMinutes % 60;
    const TotalTimeInHours = (TotalTimeInMinutes - tmpMinutes) / 60;

    console.log(Troops, GatheringAmount, GatheringSpeed, TotalTimeInHours, tmpMinutes, tmpSeconds);

    const ReturnTimeEpoch = Date.now() + (TravelTimeInSeconds + GatheringTimeInSeconds) * 1000;
    const ReturnTime = new Date(ReturnTimeEpoch);

    document.getElementById("ksReturnTime").value = ReturnTime.toISOString().substring(0, 19);
}

document.getElementById("ksForm").addEventListener("input", calcReturnTime);
document.getElementById("ksForm").addEventListener("submit", (event) => {
    event.preventDefault();
});
