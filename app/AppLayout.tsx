"use client";

import {
    SkipLink,
    Breadcrumbs,
    GridRow,
    GridCol,
    Main,
    GlobalStyle,
    Footer
} from "govuk-react";
import { createGlobalStyle } from "styled-components";
import TopNavbar from "./components/TopNavbar";

const CustomGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #fffbe3;
  }
`;

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GlobalStyle />
            <CustomGlobalStyle />
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            
            <TopNavbar />

            <Main>
                <GridRow>
                    <GridCol setWidth="two-thirds">
                        <Breadcrumbs>
                            <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
                        </Breadcrumbs>

                        <div id="main-content">
                            {children}
                        </div>
                    </GridCol>
                </GridRow>
            </Main>

            <Footer licence={(<span>Made with ❤️ by Tianjin International School. Created by Insung Cho and Mr. Bassett.</span>)}>
   
            </Footer>
        </>
    );
} 