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
                            `Select an <b>Actor</b> from the provided list that best fits the individual that would be attempting ` +
                            `to achieve this competency. The <b>Description</b> field allows you to enter additional information that ` +
                            `may be previlent to defining your actor (i.e. prerequiste classes, competition details, etc...).</p>`
                    },
                    {
                        question: 'Building Behavior',
                        answer: `<p>The competency builder Behavior form has entry fields <b>Workrole</b>, <b>Task</b>, ` +
                            `and <b>Task Description</b>. You can search and select a <b>Workrole</b> which is a NICE work role*. ` +
                            `<b>Task</b>'s can also be searched and added to the competency here. These are also ` +
                            `taken from the NICE Framework*. Multiple tasks can be added here. <b>Task Description</b> is the unique task(s) an actor ` +
                            `will be attempting to earn this competency (The specific task(s) relating to a classroom lesson, a ` +
                            `competition, etc.).</p>` +
                            `<p>*The work roles and task lists will be expanded upon as more frameworks like ` +
                            `<a href="https://public.cyber.mil/wid/dcwf/" target="_blank">DCWF</a> are adopted for the builder.</p>`
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
                        answer: '<p>The competency builder Degree ' +
                            `` +
                            `</p>`
                    },
                    {
                        question: 'Building Employability',
                        answer: '<p>The competency builder Employability ' +
                            `` +
                            `</p>`
                    },
                    {
                        question: 'Building Notes',
                        answer: '<p>The competency builder Notes ' +
                            `` +
                            `</p>`
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
                title: 'Author Dashboard',
                questions: [
                    {
                        question: 'What is a learning object?',
                        answer: 'A <em>learning object</em> is a free piece of curriculum that is used to teach cyber and cyber-related ' +
                            'material in varying types of classrooms. Every learning object is created by a registered CLARK author. ' +
                            'Learning objects represent the main content found on CLARK.'
                    },
                    {
                        question: 'How does a learning object work?',
                        answer: 'A learning object is made up of different components. Each learning object will have a description ' +
                            'of the curriculum along with learning outcomes, academic levels, and materials related to the learning ' +
                            'object. All registered CLARK users are able to download the learning object files and ancillary materials ' +
                            '(some learning objects might be URL link-based only). All registered authors can also save learning ' +
                            'objects to their personalized CLARK library.'
                    }
                ]
            },
            {
                title: `A Competnency's Lifecycle`,
                questions: [
                    {
                        question: `What is the competency lifecycle?`,
                        answer: 'A <em>learning object</em> is a free piece of curriculum that is used to teach cyber and cyber-related ' +
                            'material in varying types of classrooms. Every learning object is created by a registered CLARK author. ' +
                            'Learning objects represent the main content found on CLARK.'
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
                        answer: '<p>Competency Constructor is a platform to create, publish, and maintain competencies.</p>'
                    },
                    {
                        question: `Can I use Competency Constructor?`,
                        answer: `<p><b>As of Spring 2023, Competency Constructor is in a closed beta.</b><br><br>` +
                            `Competency Constructor is currently available to academics in higher education institutions that are a ` +
                            `part of the ` +
                            `<a aria-label="Clickable link to CAE community site" href="https://www.caecommunity.org/" ` +
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
