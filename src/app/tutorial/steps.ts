import { Tour } from 'nextstepjs';

export const steps: Tour[] = [
    {
        tour: "mainTour",
        steps: [
            {
                icon: "👋",
                title: "Website Tour",
                content: "Welcome to our website tour! We will walk you through how to buzz around CodeHive with ease.",
                showControls: true,
                showSkip: true,
                nextRoute: "/projects/add-project",
                prevRoute: "/tutorial",
            },
            {
                icon: "🚀",
                title: "Add a Project",
                content: "This is the Add a Project page where you can add new projects.",
                selector: "#add-project-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/questions/ask-question",
                prevRoute: "/tutorial",
                side: "bottom"
            },
            {
                icon: "❓",
                title: "Ask a Question",
                content: "This is the Ask a Question page where you can ask new questions.",
                selector: "#ask-question-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/questions/answer-question",
                prevRoute: "/projects/add-project",
                side: "bottom"
            },
            {
                icon: "💬",
                title: "Answer a Question",
                content: "This is the Answer a Question page where you can answer existing questions.",
                selector: "#answer-question-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/questions/view-all-questions",
                prevRoute: "/questions/ask-question",
                side: "bottom"
            },
            {
                icon: "📋",
                title: "View All Questions",
                content: "This is the View All Questions page where you can see all the questions.",
                selector: "#view-all-questions-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/profiles/:username",
                prevRoute: "/questions/answer-question",
                side: "bottom"
            },
            {
                icon: "👤",
                title: "Profile Page",
                content: "This is the Profile page where you can view and edit your profile.",
                selector: "#profile-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/login",
                prevRoute: "/questions/view-all-questions",
                side: "bottom"
            },
            {
                icon: "🔑",
                title: "Login Page",
                content: "This is the Login page where you can log into your account.",
                selector: "#login-button",
                showControls: true,
                showSkip: true,
                nextRoute: "/projects/add-project",
                prevRoute: "/profiles/:username",
                side: "bottom"
            },
            {
                icon: "🔑",
                title: "Login Page",
                content: "This is the Login page where you can log into your account.",
                selector: "#login-button",
                showControls: true,
                showSkip: false,
                nextRoute: "/projects/add-project",
                prevRoute: "/profiles/:username",
                side: "bottom"
            }
        ]
    }
];
