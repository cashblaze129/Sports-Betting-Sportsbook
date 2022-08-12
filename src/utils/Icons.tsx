import { IconContext } from 'react-icons';
import { IoIosFootball } from 'react-icons/io';
import { GiAmericanFootballBall, GiAmericanFootballHelmet, GiBasketballBall, GiBoxingGlove, GiDeathStar } from 'react-icons/gi';

const UseIcons = (icon: string) => {
    if (icon) {
        return (
            <IconContext.Provider value={{ color: 'white', size: '60px', style: { position: 'absolute' } }}>
                {icon === 'football' ? <IoIosFootball /> : null}
                {icon === 'icehockey' ? <GiAmericanFootballHelmet /> : null}
                {icon === 'basketball' ? <GiBasketballBall /> : null}
                {icon === 'americanfootball' ? <GiAmericanFootballBall /> : null}
                {icon === 'boxing' ? <GiBoxingGlove /> : null}
            </IconContext.Provider>
        );
    }
    return (
        <IconContext.Provider value={{ color: 'white', size: '60px', style: { position: 'absolute' } }}>
            <div>
                <GiDeathStar />
            </div>
        </IconContext.Provider>
    );
};

export default UseIcons;
