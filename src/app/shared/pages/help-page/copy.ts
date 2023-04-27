export const sections = {
    builder: {
        title: 'Building a Competency',
        topics: [
            {
                title: 'The Competency Builder',
                questions: [
                    {
                        question: 'Getting Started',
                        answer: `<p>To create a competency, click the ` +
                            `<button
                                style="
                                    background-color: #386fd6;
                                    color: white;border: 0;
                                    box-shadow: 0px 6px 12px -6px #386fd6;
                                    border: 1px solid #DFDFDF;
                                    border-radius: 4px;
                                "
                            >NEW COMPETENCY</button> ` +
                            `button in the top-right corner of your dashboard. This opens the Competency Builder. The builder has ` +
                            `unique data entry fields that conform to the ABCDE model outlined in the Competency eHandbook. You navigate `+
                            `the builder based on which attribute of a competnecy you wish to enter data for.</p>` +
                            `<img 
                                src="../../../assets/competency-builder.png"
                                style="width: 100%; max-width: 500px;"
                            ></img>`
                    },
                    {
                        question: 'Building Actor',
                        answer: '<p>The competency builder Actor form has entry fields <b>Actor</b> and <b>Description</b>. ' +
                            `
                                <ul>
                                    <li><b>Actor</b>: the individual that would be attempting this competency</li>
                                    <li><b>Description</b>: additional context about the actor</li>
                                </ul>
                            ` +
                            `</p><img 
                                src="../../../assets/actorbuilder.png"
                                style="width: 100%; max-width: 500px;"
                            ></img><p>` +
                            `Select an <b>Actor</b> from the provided list that best fits the individual that would be attempting ` +
                            `to achieve this competency. The <b>Description</b> field allows you to enter additional information that ` +
                            `may be pertinent to defining your actor (i.e. pre-requisite classes, competition details, etc...).</p>` +
                            `<p><b>Both Actor and Description are required to submit a competency for review!</b></p>`
                    },
                    {
                        question: 'Building Behavior',
                        answer: `<p>The competency builder Behavior form has entry fields <b>Workrole</b>, <b>Task</b>, ` +
                            `and <b>Task Description</b>.<br>` +
                            `
                                <ul>
                                    <li><b>Workrole</b>: a cyber-workforce industry position</li>
                                    <li><b>Task</b>: a cyber-workforce industry task</li>
                                    <li><b>Task Description</b>: details about what exactly the actor should/will be doing</li>
                                </ul>
                            ` +
                            `Search and select a <b>Workrole</b> from the NICE Framework* for your competency. Search and select ` +
                            `<b>Task</b>'s from the NICE Framework* for your competency. Multiple tasks can be selected. ` +
                            `<b>Task Description</b> is the unique task(s) an actor will be attempting to earn this competency ` +
                            `(The specific task(s) relating to a classroom lesson, a competition, etc.).</p>` +
                            `<p>*The work roles and task lists will be expanded upon as more frameworks like ` +
                            `<a href="https://public.cyber.mil/wid/dcwf/" target="_blank">DCWF</a> are adopted for the builder.</p><br>` +
                            `<p><b>A Workrole, at least one Task, and a Task Descripiton are required to submit a competency for ` +
                            `review!</b></p>`
                    },
                    {
                        question: 'Building Condition & Context',
                        answer: '<p>The competency builder Condition form has entry fields for  <b>Scenario</b>, <b>Limitations</b>, ' +
                            `<b>Technology</b>, and <b>Documenation</b>.<br>` +
                            `
                                <ul>
                                    <li><b>Scenario</b>: the situation in which the actor is attempting to earn this competency.</li>
                                    <li><b>Limitations</b>: any restrictions that are placed on the actor while attempting this `+
                                    `competency.</li>
                                    <li><b>Technology</b>: the technology an actor may use for this competency.</li>
                                    <p>yeetus maximus</p>
                                    <li><b>Documentation</b>: reference files, weblinks, and other resources that an actor has access ` +
                                    `to while attempting to earn this competency.</li>
                                </ul>
                            ` +
                            `` +
                            `</p>`
                    },
                    {
                        question: 'Building Degree',
                        answer: `<p>The competency builder Degree ` +
                            `` +
                            `</p>`
                    },
                    {
                        question: 'Building Employability',
                        answer: `<p>Relates to the professional skills an individual must have in order to be successful in the ` +
                            `workplace. Examples include teamwork, communication, and problem-solving. For a full list of examples ` +
                            `please visit {{ link to that doc from Montreat }}</p>`
                    },
                    {
                        question: 'Building Notes',
                        answer: '<p>The competency builder Notes form is a secondary field that allows the author to provide ' +
                            `additional context for a competnecy that does not fit with another part of the ABCDE model.</p>`
                    },
                    {
                        question: 'Submitting a Competency',
                        answer: '<p>To submit a competency ' +
                            `` +
                            `</p>`
                    },
                ]
            },
        ]
    },
    elements: {
        title: 'Competency Ecosystem',
        topics: [
            {
                title: `A Competnency's Lifecycle`,
                questions: [
                    {
                        question: `What is the competency lifecycle?`,
                        answer: `<p>In order to facilitate the curation of competencies for the CAE Community and beyond, every competency`+
                            ` submitted will be subjected to review by the Competency Constructor Team. The Competency Constructor ` +
                            `allows you to build a competency within your own dashboard where you are the only one with the ability to ` +
                            `review and edit that competency. If you would like to submit it for review so that it can be made publicly ` +
                            `available you can do so through your dashboard {{ link to that part of the help docs }}. After it is ` +
                            `submitted it will be reviewed for applicability and our team might reach out for clarification or to ` +
                            `provide feedback on your submission. After review the decision will be made to either approve the ` +
                            `competency and publish it for public consumption or to reject the competency. If a competency is rejected ` +
                            `you will have the opportunity to make revisions to the competency and resubmit for review.</p><br>` +
                            `<p>After some time a competency might be deemed no longer relevant and be deprecated. The decision on when ` +
                            `to deprecate is up to the Competency Constructor team. If this occurs, the competency will still be ` +
                            `publicly available but will no longer be listed as published.</p>`
                    },
                ]
            },
        ]
    },
    information: {
        title: 'About',
        topics: [
            {
                title: 'About the System',
                questions: [
                    {
                        question: 'What is Competency Constructor?',
                        answer: `<p>Competency Constructor is a platform to create, publish, and maintain competencies. A competency is ` +
                            `the ability for an actor to compelte a task, or set of tasks, in the context of a work role. Our platform ` +
                            `provides the model for educators to build competencies that every NCAE-C institution can use.`
                    },
                    {
                        question: `Can I use Competency Constructor?`,
                        answer: `<p><b>As of Spring 2023, Competency Constructor is in a closed beta.</b><br><br>` +
                            `Competency Constructor is currently available to academics in higher education institutions that are a ` +
                            `part of the ` +
                            `<a aria-label="Clickable link to NCAE-C community site" href="https://www.caecommunity.org/" ` +
                            `target="_blank">CAE Community</a>. ` +
                            `Anyone may register; however, once registered, new users must email ` +
                            `<a aria-label="Clickable Registration help link" ` +
                            `href="mailto:info@secured.team?subject=Competency Constructor Registration">info@secured.team</a> ` +
                            `for access to the platform.</p>`
                    }
                ]
            }

        ]
    },
};
