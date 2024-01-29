"use client";
import {
	type ReactNode,
	Suspense,
	useLayoutEffect,
	useState,
	memo,
} from "react";
import { useServerContentStatus } from "./server-content-status";

type StaleContentSuspenseProps = {
	children: ReactNode;
	key: string;
	fallback?: ReactNode;
	opacity?: string;
};

const StaleContentSuspense = function StaleContentSuspense({
	children,
	key,
	fallback = null,
	opacity = "0.5",
}: StaleContentSuspenseProps) {
	const [prevContent, setPrevContent] = useState(children);

	let content;
	if (prevContent === children) {
		// content for initial visit or refresh
		content = fallback;
	} else {
		content = prevContent;
	}
	// when searchParams changes
	useLayoutEffect(() => {
		return () => {
			setPrevContent(children);
		};
	}, [children]);

	return (
		<>
			<Suspense
				key={key}
				fallback={<StaleContent prevContent={content} opacity={opacity} />}
			>
				{children}
				<Indicator />
			</Suspense>
		</>
	);
};

export default StaleContentSuspense;

const Indicator = () => {
	const [_, setIsLoaded] = useServerContentStatus();

	useLayoutEffect(() => {
		setIsLoaded(true);
		return () => {
			setIsLoaded(false);
		};
	}, []);
	return null;
};

type StaleContentProps = {
	prevContent: ReactNode;
	opacity: string;
};

const StaleContent = memo(function StaleContent({
	prevContent,
	opacity,
}: StaleContentProps) {
	const [isLoaded] = useServerContentStatus();

	if (!isLoaded) {
		return <div style={{ opacity: opacity }}>{prevContent}</div>;
	}

	return null;
});
