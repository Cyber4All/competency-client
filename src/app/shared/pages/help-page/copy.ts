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
                            `unique data entry fields that conform to the ABCDE model outlined in the Competency eHandbook. You navigate ` +
                            `the builder based on which attribute of a competency you wish to enter data for.</p>` +
                            `<p>` +
                            `<a href="https://competency-constructor.s3.amazonaws.com/CompetencyConstructorDataModelTemplate.pdf" ` +
                            `target="_blank">Competency Template</a><p>` +
                            `<img 
                                src="../../../assets/competency-builder.png"
                                style="width: 100%; max-width: 600px;"
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
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `Select an <b>Actor</b> from the provided list that best fits the individual that would be attempting ` +
                            `to achieve this competency. The <b>Description</b> field allows you to enter additional information that ` +
                            `may be pertinent to defining your actor (i.e. pre-requisite classes, competition details, etc...).</p>` +
                            `<p><b>Actor is required to submit a competency for review!</b></p>`
                    },
                    {
                        question: 'Building Behavior',
                        answer: `<p>The competency builder Behavior form has entry fields <b>Source</b>, <b>Workrole</b>, <b>Task</b>, ` +
                            `and <b>Task Description</b>.<br>` +
                            `
                                <ul>
                                    <li><b>Source</b>: the cyber-workforce framework of the workrole and task</li>
                                    <li><b>Workrole</b>: a cyber-workforce industry position</li>
                                    <li><b>Task</b>: a cyber-workforce industry task</li>
                                    <li><b>Task Description</b>: details about what exactly the actor should/will be doing</li>
                                </ul>
                            ` +
                            `</p><img 
                                src="../../../assets/behaviorbuilder.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `First, select a workforce framework <b>Source</b> from the list provided. ` +
                            `Search and select a <b>Workrole</b> for your competency. Search and select ` +
                            `<b>Task</b>'s for your competency. Multiple tasks can be selected. ` +
                            `<b>Task Description</b> is the unique task(s) an actor will be attempting to earn this competency ` +
                            `(The specific task(s) relating to a classroom lesson, a competition, etc.).</p><br>` +
                            `<p><b>Source, a Workrole, at least one Task, and a Task Description are required to submit a competency for ` +
                            `review!</b></p>`
                    },
                    {
                        question: 'Building Condition & Context',
                        answer: '<p>The competency builder Condition form has entry fields for  <b>Scenario</b>, <b>Limitations</b>, ' +
                            `<b>Technology</b>, and <b>Documentation</b>.<br>` +
                            `
                                <ul>
                                    <li><b>Scenario</b>: the situation in which the actor is attempting to earn this competency.</li>
                                    <li><b>Limitations</b>: any restrictions that are placed on the actor while attempting this `+
                            `competency.</li>
                                    <li><b>Technology</b>: the technology an actor may use for this competency.</li>
                                    <li><b>Documentation</b>: reference files and other resources that an actor has access ` +
                            `to while attempting to earn this competency.</li>
                                </ul>
                            ` +
                            `</p><img 
                                src="../../../assets/conditionbuilderdescrip.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `<b>Scenario</b> provides the situational context for the competency being attempted. <b>Limitations</b> ` +
                            `are any restrictions/constraints that are placed on the competency (i.e. Actor cannot use the ` +
                            `internet, etc.).<br>` +
                            `</p><img 
                                src="../../../assets/conditionbuildertech.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `<b>Technology</b> is the technology an actor may use for this competency (i.e. Windows 10, Linux, etc.). ` +
                            `To add technology to your competency, press either the <b>TAB</b> or <b>ENTER</b> key.<br>` +
                            `</p><img
                                src="../../../assets/conditiondocuments.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `<b>Documentation</b> is any external resource that can be used to complete a competency. You can upload ` +
                            `any relevant materials an actor may need to successfully complete a competency.</p>`
                        /*`<p><b>Scenario, Limitations, and at least one Technology are required to submit a competency for ` +
                        `review!</b></p>`*/
                    },
                    {
                        question: 'Building Degree',
                        answer: '<p>The competency builder Degree form has entry fields for  <b>Time</b>, <b>Correct</b>, ' +
                            `and <b>Complete</b>.<br>` +
                            `
                                <ul>
                                    <li><b>Time</b>: the duration of time the competency should be completed in</li>
                                    <li><b>Correct</b>: defines what is qualitatively acceptable for attempting a competency</li>
                                    <li><b>Complete</b>: defines what is quantitatively acceptable for 'finishing' a task or tasks</li>
                                </ul>
                            ` +
                            `</p><img
                                src="../../../assets/degree.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br></p>`
                        /*`<p><b>Time, Correct, and Complete are required fields to submit a competency for ` +
                        `review!</b></p>`*/
                    },
                    {
                        question: 'Building Employability',
                        answer: `<p>Relates to the professional competencies an individual must have in order to be successful in the ` +
                            `workplace. Examples include teamwork, communication, and problem-solving. For a full list of examples ` +
                            `please visit 
                            <a href="https://competency-constructor.s3.amazonaws.com/Defining+Montreat+360+Competencies+and+Skills.pdf" ` +
                            `target="_blank">Montreat 360 Competencies and Skills</a>.</p>`
                        //`<p><b>Employability is required to submit a competency for review!</b></p>`
                    },
                    {
                        question: 'Building Notes',
                        answer: '<p>The competency builder Notes form is an optional field that allows the author to provide ' +
                            `additional context for a competency that does not fit with another part of the ABCDE model.</p>` +
                            `<br><p>As Competency Constructor continues to evolve, the builder will also evolve to accommodate new ` +
                            `features and functionality. If you have any questions or suggestions for the builder, please ` +
                            `contact us at <a href="mailto:info@secured.team?subject=Builder%20Suggestions">info@secured.team</a></p>`
                    },
                    {
                        question: 'Submitting a Competency',
                        answer: '<p>You can submit a competency to be reviewed in the <b>Review</b> tab of the competency builder. ' +
                            `Please ensure your competency is free of grammar errors and is filled out with the required fields.` +
                            `After reviewing your competency, click the ` +
                            `<button
                                style="
                                    background-color: #386fd6;
                                    color: white;border: 0;
                                    box-shadow: 0px 6px 12px -6px #386fd6;
                                    border: 1px solid #DFDFDF;
                                    border-radius: 4px;
                                "
                            >SUBMIT COMPETENCY</button> button to submit it for a curated review.</p><br>` +
                            `<img
                                src="../../../assets/review.png"
                                style="width: 100%; max-width: 600px;"
                            ></img>`
                    },
                ]
            },
        ]
    },
    elements: {
        title: 'Competency Ecosystem',
        topics: [
            {
                title: `A Competency's Lifecycle`,
                questions: [
                    {
                        question: `What is the competency lifecycle?`,
                        answer:
                            `</p><img
                                src="../../../assets/lifecycles.png"
                                style="width: 100%; max-width: 600px;"
                            ></img><br><p>` +
                            `<p>In order to facilitate the curation of competencies for the CAE Community and beyond, every competency` +
                            ` submitted will be subjected to review by the Competency Constructor Team. The Competency Constructor ` +
                            `allows you to build a competency within your own dashboard where you are the only one with the ability to ` +
                            `review and edit that competency. If you would like to submit it for review so that it can be made publicly ` +
                            `available you can do so through the competency builder when you are finished with all edits. After it is ` +
                            `submitted, it will be reviewed for applicability and our team might reach out for clarification or to ` +
                            `provide feedback on your submission. After review the decision will be made to either approve the ` +
                            `competency and publish it for public consumption or to reject the competency. If a competency is rejected ` +
                            `you will have the opportunity to make revisions to the competency and resubmit for review.</p><br>` +
                            `<p>After some time a competency might be deemed no longer relevant and be deprecated. The decision on when ` +
                            `to deprecate is up to the Competency Constructor Team. If this occurs, the competency will still be ` +
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
                            `the ability for an actor to complete a task, or set of tasks, in the context of a work role. Our platform ` +
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
