import { NextStepProvider, NextStep } from 'nextstepjs';
import { AppProps } from 'next/app';
import { steps } from './tutorial/steps';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <NextStepProvider>
            <NextStep steps={steps}>
                <Component {...pageProps} />
            </NextStep>
        </NextStepProvider>
    );
}