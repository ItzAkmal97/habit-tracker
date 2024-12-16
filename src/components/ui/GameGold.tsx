const GameGold = () => {
  return (
    <div className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width="40"
        height="30"
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="gold"
          stroke="darkgoldenrod"
          stroke-width="10"
        />

        <polygon
          points="100,30 120,80 175,80 130,115 150,170 100,140 50,170 70,115 25,80 80,80"
          fill="orange"
          stroke="darkorange"
          stroke-width="5"
        />

        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, sans-serif"
          font-size="24"
          fill="white"
          stroke="black"
          stroke-width="1"
        ></text>
      </svg>
      <span className="font-extrabold text-lg">129</span>
    </div>
  );
};

export default GameGold;
