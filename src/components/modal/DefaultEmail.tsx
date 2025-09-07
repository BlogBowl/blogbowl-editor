import { API } from '@/types.ts';
import dayjs from 'dayjs';

const DefaultEmail = ({
    subject,
    content_html,
    author,
    settings,
}: API.Email) => {
    return (
        <>
            <style type="text/css">
                {`   figure {
                border-left: 3px solid black;
                padding-left: 16px;
                margin: 25px 0;
            }

                blockquote {
                margin: 0px;
            }

                h2 {
                font-size: 26px;
                font-weight: bold;
                padding: 5px 0 2.5px 0;
            }

                h3 {
                font-size: 24px;
                font-weight: bold;
                padding: 5px 0 2.5px 0;
            }

                h4 {
                font-size: 22px;
                font-weight: bold;
                padding: 4px 0 2px 0;
            }

                h5 {
                font-size: 20px;
                font-weight: bold;
                padding: 3px 0 1.5px 0;
            }

                h6 {
                font-size: 18px;
                font-weight: bold;
                padding: 3px 0 1.5px 0;
            }

                hr {
                display: block;
                height: 1px;
                border: 0;
                border-top: solid 1px rgba(55, 53, 47, 0.09);
                margin: 3px 0;
            }

               img {
                border-radius: 5px;
                margin: 10px 0;
            }`}
            </style>
            <div>
                <div style={{ margin: '0px auto', maxWidth: 645 }}>
                    <table
                        align="center"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        role="presentation"
                        style={{ width: '100%' }}
                    >
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        direction: 'ltr',
                                        fontSize: 0,
                                        padding: '0',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        className="m_-4296147659606801758mj-column-per-100"
                                        style={{
                                            fontSize: 0,
                                            textAlign: 'left',
                                            direction: 'ltr',
                                            display: 'inline-block',
                                            verticalAlign: 'top',
                                            width: '100%',
                                        }}
                                    >
                                        <table
                                            border={0}
                                            cellPadding={0}
                                            cellSpacing={0}
                                            role="presentation"
                                            style={{ verticalAlign: 'top' }}
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        style={{
                                                            fontSize: 0,
                                                            padding:
                                                                '10px 25px',
                                                            paddingRight: 4,
                                                            paddingLeft: 4,
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily:
                                                                    'Helvetica',
                                                                fontSize: 16,
                                                                lineHeight:
                                                                    '1.5',
                                                                textAlign:
                                                                    'left',
                                                                color: '#37352f',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display:
                                                                        'inline-block',
                                                                    fontSize: 30,
                                                                    lineHeight:
                                                                        '1.3',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {subject}
                                                            </span>
                                                            <table
                                                                width="100%"
                                                                style={{
                                                                    borderCollapse:
                                                                        'collapse',
                                                                    marginTop: 24,
                                                                }}
                                                            >
                                                                <tbody>
                                                                    <tr>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    'left',
                                                                            }}
                                                                        >
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td
                                                                                            style={{
                                                                                                paddingRight: 10,
                                                                                                paddingTop: 7,
                                                                                            }}
                                                                                        >
                                                                                            {author?.avatar && (
                                                                                                <img
                                                                                                    src={
                                                                                                        author.avatar
                                                                                                    }
                                                                                                    alt={
                                                                                                        author?.formatted_name
                                                                                                    }
                                                                                                    style={{
                                                                                                        borderRadius:
                                                                                                            '50%',
                                                                                                        width: '45px',
                                                                                                        height: '45px',
                                                                                                        objectFit:
                                                                                                            'cover',
                                                                                                        margin: 0,
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        </td>
                                                                                        <td>
                                                                                            <table>
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            style={{
                                                                                                                padding: 0,
                                                                                                            }}
                                                                                                        >
                                                                                                            <span
                                                                                                                style={{
                                                                                                                    fontSize: 13,
                                                                                                                }}
                                                                                                            >
                                                                                                                {
                                                                                                                    author?.formatted_name
                                                                                                                }
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            style={{
                                                                                                                padding: 0,
                                                                                                            }}
                                                                                                        >
                                                                                                            <span
                                                                                                                style={{
                                                                                                                    fontSize: 11,
                                                                                                                    color: 'rgb(119,119,119)',
                                                                                                                }}
                                                                                                            >
                                                                                                                {dayjs().format(
                                                                                                                    'MMM D, YYYY',
                                                                                                                )}
                                                                                                            </span>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        {/*                        <td style="text-align:right">*/}
                                                                        {/*                          <a href="https://x.com"*/}
                                                                        {/*                             style="margin-left:10px;text-decoration:none;border:1px solid #808080;border-radius:50%;padding:5px 6px"*/}
                                                                        {/*                             target="_blank">*/}
                                                                        {/*                            <img src="https://imagedelivery.net/gLgcD68SxSCB7eEUDDEJXQ/08ffb20e-e4e6-4abf-50c8-a3b8cdce0100/tiny"*/}
                                                                        {/*                                 alt="Share on X" width="16" height="16"*/}
                                                                        {/*                                 style="vertical-align:middle" class="CToWUd"*/}
                                                                        {/*                                 data-bit="iit">*/}
                                                                        {/*                          </a>*/}
                                                                        {/*                          <a href="https://www.linkedin.com"*/}
                                                                        {/*                             style="margin-left:10px;text-decoration:none;border:1px solid #808080;border-radius:50%;padding:5px 6px"*/}
                                                                        {/*                             target="_blank">*/}
                                                                        {/*                            <img src="https://imagedelivery.net/gLgcD68SxSCB7eEUDDEJXQ/28433c2a-60cb-48bc-336f-d6556fcfe400/tiny"*/}
                                                                        {/*                                 alt="Share on LinkedIn" width="16"*/}
                                                                        {/*                                 height="16" style="vertical-align:middle"*/}
                                                                        {/*                                 data-bit="iit">*/}
                                                                        {/*                          </a>*/}
                                                                        {/*                          <a href="https://u47023825.ct.sendgrid.net/ls/click?upn=u001.l6ae-2FZvqEuNfW3iAGGQzUf1TClRdFxEE96DdQpI63X-2BCSoqkFcj-2FSM-2FoHWR0MIclreR2IZyFK1FOc0kTGmFYEDKLNNV0pH2umXGZdRm7QrvChZURXybhJlrOu6FplDFWC64S5-2BErLc59Qrh1lEOLnxyvhYQkRqI5jlBKsw9F3Vc-3D2aOf_xBMKTeQbuGMd9x2U2K3ABoC6yMhvkZNemTS8Mu-2FVVUbLpZBUHLQiIVWlahELXRmK-2BRvXjwjE-2Bp4i2gd0ktmN5ZaTFbFAXhHA7x-2BbEpOVmRHNaxBCYGv-2BRSfiJIoFhQ7Epq9BQHUr45C5ZRTnCbqq1-2FB9GWXRI2XmZT-2BJZGXrYHZqg-2B9S2h-2B9NUyMKOKwQ6D5gXouo7Iz4OnKaAufPAs0epmG5y5BzUjcI2-2BEAQ-2Bw4vCKfwkv3tCncLdOerhwjbS64xh8gHQ1mpMjKuwisc3OzZJ9LEqc6S4jlncIjmvrrpRrTn5giuIU-2FrVbkxznhnl30l6QnCeG9TUwPfkRc9iVpf2B9mitSwnxEKgt0KEQyat0WPOZgNNFH2iaWGSj3jWieaMt4ekrQZVMB0beT-2F9AS63Rofgbev-2F0xB37NqJwXXGE6iGZSZaeDUusDoUhreCuWphuFw5rRTSUDEaI5PNNew-3D-3D"*/}
                                                                        {/*                             style="margin-left:10px;text-decoration:none;border:1px solid #808080;border-radius:50%;padding:5px 6px"*/}
                                                                        {/*                             target="_blank">*/}
                                                                        {/*                            <img src="https://imagedelivery.net/gLgcD68SxSCB7eEUDDEJXQ/905e17db-ceff-4225-3ce1-a3d802382600/tiny"*/}
                                                                        {/*                                 alt="Share on Facebook" width="16"*/}
                                                                        {/*                                 height="16" style="vertical-align:middle"*/}
                                                                        {/*                                 data-bit="iit">*/}
                                                                        {/*                          </a>*/}
                                                                        {/*                          <a href="mailto:?subject=Post+from+Tibo's+blog's+Newsletter&amp;body=People+trolling+your+product+is+a+good+thing+https://www.tmaker.io/people-trolling-your-product-is-a-good-thing"*/}
                                                                        {/*                             style="margin-left:10px;text-decoration:none;border:1px solid #808080;border-radius:50%;padding:5px 6px"*/}
                                                                        {/*                             target="_blank">*/}
                                                                        {/*                            <img src="https://imagedelivery.net/gLgcD68SxSCB7eEUDDEJXQ/e27ff5ce-f579-4b66-c880-f377c09ca900/tiny"*/}
                                                                        {/*                                 alt="Share on Email" width="16" height="16"*/}
                                                                        {/*                                 style="vertical-align:middle"*/}
                                                                        {/*                                 data-bit="iit">*/}
                                                                        {/*                          </a>*/}
                                                                        {/*                        </td>*/}
                                                                    </tr>
                                                                    <tr>
                                                                        <td
                                                                            align="center"
                                                                            style={{
                                                                                fontSize: 0,
                                                                                padding:
                                                                                    '10px 10px',
                                                                                wordBreak:
                                                                                    'break-word',
                                                                            }}
                                                                        >
                                                                            <hr />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ margin: '0px auto', maxWidth: 645 }}>
                    <table
                        align="center"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        role="presentation"
                        style={{ width: '100%' }}
                    >
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        direction: 'ltr',
                                        fontSize: 0,
                                        padding: 0,
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        className="m_-4296147659606801758mj-column-per-100"
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'left',
                                            direction: 'ltr',
                                            display: 'inline-block',
                                            verticalAlign: 'top',
                                            width: '100%',
                                            fontFamily: 'Helvetica',
                                            lineHeight: '1.5',
                                            color: '#37352f',
                                        }}
                                    >
                                        <table
                                            border={0}
                                            cellPadding={0}
                                            cellSpacing={0}
                                            role="presentation"
                                            style={{ verticalAlign: 'top' }}
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        className="m_-4296147659606801758nl-pad"
                                                        style={{
                                                            fontSize: 0,
                                                            padding:
                                                                '10px 10px',
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily:
                                                                    'Helvetica',
                                                                fontSize: 16,
                                                                lineHeight:
                                                                    '1.5',
                                                                textAlign:
                                                                    'left',
                                                                color: '#37352f',
                                                            }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: content_html,
                                                            }}
                                                        ></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="" style={{ margin: '0px auto', maxWidth: 645 }}>
                    <table
                        align="center"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        role="presentation"
                        style={{ width: '100%' }}
                    >
                        <tbody>
                            <tr>
                                <td
                                    style={{
                                        direction: 'ltr',
                                        fontSize: 0,
                                        padding: '20px 0',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        className="m_-4296147659606801758mj-column-per-100"
                                        style={{
                                            fontSize: 0,
                                            textAlign: 'left',
                                            direction: 'ltr',
                                            display: 'inline-block',
                                            verticalAlign: 'top',
                                            width: '100%',
                                        }}
                                    >
                                        <table
                                            border={0}
                                            cellPadding={0}
                                            cellSpacing={0}
                                            role="presentation"
                                            style={{ verticalAlign: 'top' }}
                                            width="100%"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        align="center"
                                                        style={{
                                                            fontSize: 0,
                                                            padding:
                                                                '10px 10px',
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        <hr />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        align="left"
                                                        className="m_-4296147659606801758newsletter-footer m_-4296147659606801758nl-pad"
                                                        style={{
                                                            fontSize: 0,
                                                            padding:
                                                                '10px 10px',
                                                            wordBreak:
                                                                'break-word',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontFamily:
                                                                    'Helvetica',
                                                                fontSize: 14,
                                                                lineHeight:
                                                                    '1.5',
                                                                textAlign:
                                                                    'center',
                                                                color: '#a8aaaf',
                                                            }}
                                                        >
                                                            {settings?.footer &&
                                                                settings.footer
                                                                    .split('\n')
                                                                    .map(
                                                                        item => (
                                                                            <p
                                                                                style={{
                                                                                    marginTop: 0,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    item
                                                                                }
                                                                            </p>
                                                                        ),
                                                                    )}
                                                            <a
                                                                href="https://www.blogbowl.io?utm=powered-by-email"
                                                                target="_blank"
                                                                style={{
                                                                    marginTop: 25,
                                                                }}
                                                            >
                                                                Powered by
                                                                BlogBowl
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DefaultEmail;
