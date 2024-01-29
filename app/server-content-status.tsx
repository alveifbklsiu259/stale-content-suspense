"use client";
import { createContext, useContext, useState } from "react";

const ServerContentStatusContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>> | null]
>([false, null]);

type ServerContentStatusProviderProps = {
	children: React.ReactNode;
};

export default function ServerContentStatusProvider({
	children,
}: ServerContentStatusProviderProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<ServerContentStatusContext.Provider value={[isLoaded, setIsLoaded]}>
			{children}
		</ServerContentStatusContext.Provider>
	);
}

export const useServerContentStatus = () => {
	const [isLoaded, setIsLoaded] = useContext(ServerContentStatusContext);

	if (setIsLoaded === null) {
		throw new Error("server-content-status context has not been initialized");
	}
	return [isLoaded, setIsLoaded] as const;
};
