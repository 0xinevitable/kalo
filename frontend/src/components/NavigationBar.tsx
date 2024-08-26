import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Breakpoints = {
  Mobile: 512,
  Tablet: 768,
  Desktop: 1440,
};

const onMobile = `@media (max-width: ${Breakpoints.Mobile}px)`;

const NAVIGATION_ITEMS = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/home',
  },
];

export const NavigationBar = () => {
  const router = useRouter();
  const currentPath = useMemo(() => {
    // FIXME:
    if (router.route.startsWith('/u/')) {
      // e.g. /profile/intro
      return '/home';
    }
    return router.route;
  }, [router]);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // const { t, i18n } = useTranslation('common');
  // const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  // const onChangeLocale = useCallback(
  //   () =>
  //     router.push(router.asPath, router.asPath, {
  //       locale: currentLanguage === 'en' ? 'ko' : 'en',
  //     }),
  //   [i18n, currentLanguage],
  // );

  // const { width: windowWidth } = useWindowSize();
  // useEffect(() => {
  //   if (isMobileMenuOpen && windowWidth > 680) {
  //     setMobileMenuOpen(false);
  //   }
  // }, [isMobileMenuOpen, windowWidth]);

  return (
    <Wrapper>
      <Container>
        <NavigationList>
          {NAVIGATION_ITEMS.map((item) => (
            <NavigationItem
              key={`${item.title}-${item.href}`}
              active={currentPath === item.href}
            >
              <Link href={item.href}>
                {/* <span className="title">{t(item.title)}</span> */}
                <span className="title">{item.title}</span>
              </Link>
            </NavigationItem>
          ))}
        </NavigationList>

        <RightContent>
          {/* <LanguageBadge onClick={onChangeLocale}>
            {currentLanguage.toUpperCase()}
          </LanguageBadge> */}
          <StartButton>Connect Wallet</StartButton>
        </RightContent>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  padding: 0 20px;

  display: flex;
  justify-content: center;
  overflow: hidden;

  position: fixed;
  top: 36px;
  left: 0;
  right: 0;
  z-index: 90;

  &,
  * {
    user-select: none;
    transition: all 0.2s ease;
  }

  ${onMobile} {
    padding: 0 8px;
    top: 20px;
  }
`;
const Container = styled.div`
  padding: 10px 12px;
  width: 100%;
  max-width: 1000px;
  height: 56px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 10px;

  border-radius: 16px;
  background: #fff;
  box-shadow: 0px 16px 32px 0px rgba(29, 0, 79, 0.06);

  ${onMobile} {
    height: fit-content;
    padding: 12px 0;
    padding-left: 16px;
    padding-right: 10px;
  }
`;

const NavigationList = styled.ul`
  display: flex;
  gap: 20px;

  ${onMobile} {
    gap: 12px;
  }
`;

type NavigationItemProps = {
  active?: boolean;
};
const NavigationItem = styled.li<NavigationItemProps>`
  position: relative;
  color: #343639;

  * {
    transition: color 0.05s ease;
  }

  & > a {
    display: flex;
    justify-content: center;
    align-items: center;

    span.title {
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
    }
  }

  ${({ active }) =>
    active &&
    css`
      color: white;

      &::after {
        height: 4px;
      }
    `};
`;

const RightContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;

  ${onMobile} {
    gap: 10px;
  }
`;
const LanguageBadge = styled.button`
  padding: 8px;
  width: fit-content;

  background: rgba(151, 163, 182, 0.22);
  border: 2px solid #97a3b6;
  border-radius: 8px;

  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.02em;
  color: #97a3b6;
`;

// FIXME: Home button 추상화
const Button = styled.button`
  display: flex;
  height: 36px;
  padding: 3px 11px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: #ddd;
  color: rgba(126, 126, 126, 0.88);

  font-size: 16px;
  font-weight: 700;
  line-height: 105%; /* 16.8px */
  letter-spacing: -0.65px;

  &.primary {
    background: #5d00ff;
    color: #ffffff;
  }
`;

const StartButton = styled(Button)`
  ${onMobile} {
    padding: 12px 24px;
    font-size: 14px;
  }
`;
