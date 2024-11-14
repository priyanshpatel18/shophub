interface LoaderProps {
  isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
  return (
    <div
      className={`bg-background fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
        isLoading ? "opacity-100 z-50" : "opacity-0 -z-10"
      }`}
    >
      <div className="relative w-24 h-24 border-[3.5px] border-primary rounded-full animate-spin">
        <div
          className="absolute inset-0 w-14 h-14 m-auto border-[3px] border-secondary border-l-transparent border-r-transparent rounded-full"
          style={{
            animation: "spin 15s linear infinite",
          }}
        ></div>
      </div>
    </div>
  );
}
