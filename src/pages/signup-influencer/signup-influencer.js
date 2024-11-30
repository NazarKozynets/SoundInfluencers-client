import React, {useEffect} from "react";
import Header from "../../components/Header";
import SignupInfluencer from "../../components/layout/signup/SignupInfluencer";
import Background from "../../components/Background";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentWindow} from "../../redux/slice/signup-influencer";
import SignupInfluencerModalSocialMediaDetails
    from "../../components/layout/signup/SignupInfluencerModalSocialMediaDetails";

const SignupInfluencerPage = () => {
    const dispatch = useDispatch();
    const currentWindow = useSelector((state) => state.signupInfluencer.currentWindow);

    useEffect(() => {
        return () => {
            dispatch(setCurrentWindow(0));
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, [currentWindow]);

    return (
        <>
            <Header userType="client" path="Influencer" page="signup"/>
            {
                [
                    <SignupInfluencer/>,
                    <SignupInfluencerModalSocialMediaDetails/>,
                ][currentWindow]
            }
            <Background/>
        </>
    );
};

export default SignupInfluencerPage;
