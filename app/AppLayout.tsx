"use client";

import {
    useUser
} from "./components/AuthComponents";
import {
    TopNav,
    Footer,
    SkipLink,
    Breadcrumbs,
    GridRow,
    GridCol,
    Main,
    GlobalStyle
} from "govuk-react";
import { createGlobalStyle } from "styled-components";
import { isTeacher, isAdmin } from "@/lib/acl";

const CustomGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f3f2f1;
  }
  
  /* Make the top navigation more compact */
  .govuk-header {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  
  .govuk-header__logotype {
    margin-right: 5px;
  }
  
  .govuk-header__content {
    padding-left: 10px;
  }
  
  .govuk-header__link {
    margin-right: 10px;
  }
`;

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useUser();
    
    return (
        <>
            <GlobalStyle />
            <CustomGlobalStyle />
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <TopNav
                company={<TopNav.Anchor href="/">Tianjin International School</TopNav.Anchor>}
                serviceTitle="Service Projects & Internships"
            >
                {user && (
                    <TopNav.NavLink href="/opportunities">
                        Opportunities
                    </TopNav.NavLink>
                )}
                {user && (
                    <TopNav.NavLink href="/my-applications">
                        My Applications
                    </TopNav.NavLink>
                )}
                
                {user && isTeacher(user) && (
                    <TopNav.NavLink href="/manage-applications">
                        Manage Applications
                    </TopNav.NavLink>
                )}
                
                {user && isAdmin(user) && (
                    <TopNav.NavLink href="/admin/dashboard">
                        Admin Dashboard
                    </TopNav.NavLink>
                )}
            </TopNav>

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