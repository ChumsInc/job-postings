import styled from "@emotion/styled";

const JobPostingsContainer = styled.div`
    :root {
        --job-margin: 1rem;
        --job-top-margin: 3rem;
        --job-section-bottom-margin: 2rem;
    }  

    #job-openings {
        font-family: Roboto, sans-serif;
        letter-spacing: .025em;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeSpeed;

        h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }

        .job-openings {
            &--list {
                a {
                    font-weight: 500;
                }
                small {
                    font-weight: 100;
                    display: inline-block;
                    margin-left: 1rem;
                }
            }
        }

        .job-opening {
            border-top: 1px solid #666666;
            padding: var(--job-top-margin), var(--job-margin);

            &--title {
                margin-left: calc(-1 * var(--job-margin));
                font-size: 2.5rem;
            }
            section {
                padding-left: var(--job-margin);
                margin-bottom: var(--job-section-bottom-margin);
                h3 {
                    font-size: 1.5rem;
                    margin-left: calc(-1 * var(--job-margin));
                    letter-spacing: 0.05em;
                }
                h4 {
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                }
            }
            &--description {
                h4 {
                    margin-top: var(--job-margin);
                }
            }
        }
    }

`

export default JobPostingsContainer;
