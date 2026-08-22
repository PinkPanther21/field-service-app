const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center py-30">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <div className="text-white text-2xl">Loading...</div>
        </div>
    );
};

export default LoadingSpinner;