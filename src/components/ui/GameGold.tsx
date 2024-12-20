interface GoldProps {
  gold: string
}
const GameGold: React.FC<GoldProps> = ({gold}) => {
  return (
    <div className={`flex items-center gap-1`}>
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
          strokeWidth="10"
        />

        <polygon
          points="100,30 120,80 175,80 130,115 150,170 100,140 50,170 70,115 25,80 80,80"
          fill="orange"
          stroke="darkorange"
          strokeWidth="5"
        />
      </svg>
      <span className="font-extrabold text-lg">{gold}</span>
    </div>
  );
};

export default GameGold;
