const Subject = require('../models/Subject');

const seedSubjects = async () => {
  try {
    const subjectsData = [
      {
        name: 'Database Management Systems',
        code: 'BTCS-23502',
        semester: 5,
        ltpc: '3-0-0-3',
        section: 'Section A',
        isGlobal: true,
        description:
          'Core B.Tech CSE Section A subject covering database architecture, models, SQL, normalization, transactions, concurrency, recovery, security, and advanced databases.',
        units: [
          {
            unitNumber: 1,
            title: 'Database System Architecture',
            topics: [
              { title: 'Data Abstraction' },
              { title: 'Data Independence' },
              { title: 'Data Definition Language (DDL)' },
              { title: 'Instances and Schemas' },
              { title: 'Data Manipulation Language (DML)' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Data Models',
            topics: [
              { title: 'Entity-Relationship (ER) Model' },
              { title: 'Network Model' },
              { title: 'Relational Data Model' },
              { title: 'Hierarchical Data Model' },
              { title: 'Integrity Constraints' },
              { title: 'Data Manipulation Operations' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Relational Query Languages',
            topics: [
              { title: 'Relational Algebra' },
              { title: 'Tuple Relational Calculus' },
              { title: 'Domain Relational Calculus' },
              { title: 'Extended Relational Algebra Operations' },
            ],
          },
          {
            unitNumber: 4,
            title: 'SQL',
            topics: [
              { title: 'Basic Structure of SQL' },
              { title: 'Set Operations' },
              { title: 'Aggregate Functions' },
              { title: 'Nested Subqueries' },
              { title: 'Views' },
              { title: 'Modification of Databases' },
              { title: 'Joined Relations' },
              { title: 'DDL Operations' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Relational Database Design',
            topics: [
              { title: 'Pitfalls in Relational Database Design' },
              { title: 'Decomposition' },
              { title: 'Functional Dependencies' },
              { title: 'Dependency Preservation' },
              { title: 'Lossless Design' },
              { title: 'First Normal Form (1NF)' },
              { title: 'Second Normal Form (2NF)' },
              { title: 'Normalization using Functional Dependencies' },
              { title: 'Armstrong’s Axioms' },
              { title: 'Boyce-Codd Normal Form (BCNF)' },
              { title: 'Third Normal Form (3NF)' },
            ],
          },
          {
            unitNumber: 6,
            title: 'Storage Strategies',
            topics: [
              { title: 'Indexing' },
              { title: 'Primary Index' },
              { title: 'Clustering Index' },
              { title: 'Secondary Index' },
              { title: 'Sparse Index' },
              { title: 'Dense Index' },
              { title: 'Multilevel Indexing' },
            ],
          },
          {
            unitNumber: 7,
            title: 'Transaction Processing',
            topics: [
              { title: 'ACID Properties' },
              { title: 'Transaction States' },
              { title: 'Serializability' },
              { title: 'Recoverability' },
              { title: 'Testing of Serializability' },
            ],
          },
          {
            unitNumber: 8,
            title: 'Concurrency Control',
            topics: [
              { title: 'Locking Protocols' },
              { title: 'Time-stamp Based Protocols' },
              { title: 'Validation Based Protocol' },
              { title: 'Multiple Granularity' },
            ],
          },
          {
            unitNumber: 9,
            title: 'Recovery Systems',
            topics: [
              { title: 'Log Based Recovery' },
              { title: 'Shadow Paging Techniques' },
            ],
          },
          {
            unitNumber: 10,
            title: 'Database Security',
            topics: [
              { title: 'Authentication' },
              { title: 'Authorization' },
              { title: 'Granting of Privileges' },
              { title: 'Security Specifications in SQL' },
              { title: 'Access Control' },
              { title: 'DAC and MAC' },
              { title: 'RBAC Models' },
            ],
          },
          {
            unitNumber: 11,
            title: 'Advanced Topics',
            topics: [
              { title: 'Logical Databases' },
              { title: 'Web Databases' },
              { title: 'Distributed Databases' },
              { title: 'Spatial Databases' },
            ],
          },
        ],
      },
      {
        name: 'Programming in Java',
        code: 'BTCS-23501',
        semester: 5,
        ltpc: '3-0-0-3',
        section: 'Section A',
        isGlobal: true,
        description:
          'Core B.Tech CSE Section A subject covering Object-Oriented Programming in Java, classes, inheritance, exception handling, multithreading, collections, networking, and JDBC.',
        units: [
          {
            unitNumber: 1,
            title: 'Overview of Java',
            topics: [
              { title: 'Object Oriented Programming' },
              { title: 'Programming Paradigms' },
              { title: 'Abstraction' },
              { title: 'OOP Principles' },
              { title: 'Java Class Libraries' },
              { title: 'Data Types' },
              { title: 'Variables' },
              { title: 'Arrays' },
              { title: 'Integers' },
              { title: 'Floating-point Types' },
              { title: 'Characters' },
              { title: 'Boolean' },
              { title: 'Literals' },
              { title: 'Data Type Casting' },
              { title: 'Automatic Type Promotion in Expressions' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Operators and Control Statements',
            topics: [
              { title: 'Arithmetic Operators' },
              { title: 'Bitwise Operators' },
              { title: 'Relational Operators' },
              { title: 'Boolean Logical Operators' },
              { title: 'Ternary (?) Operator' },
              { title: 'Operator Precedence' },
              { title: 'Selection Statements' },
              { title: 'Iteration Statements' },
              { title: 'Jump Statements' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Introduction to Classes',
            topics: [
              { title: 'Class Fundamentals' },
              { title: 'Declaring Object Reference Variables' },
              { title: 'Introducing Methods' },
              { title: 'Constructors' },
              { title: 'this Keyword' },
              { title: 'Garbage Collection' },
              { title: 'finalize() Method' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Methods and Classes',
            topics: [
              { title: 'Method Overloading' },
              { title: 'Objects as Parameters' },
              { title: 'Recursion' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Inheritance',
            topics: [
              { title: 'Inheritance Basics' },
              { title: 'Types of Inheritance' },
              { title: 'super Keyword' },
              { title: 'Method Overriding' },
              { title: 'Packages' },
              { title: 'Interfaces' },
              { title: 'Package Access Protection' },
              { title: 'Importing Packages' },
            ],
          },
          {
            unitNumber: 6,
            title: 'Exception Handling',
            topics: [
              { title: 'Exception Handling Fundamentals' },
              { title: 'Exception Types' },
              { title: 'Uncaught Exceptions using try-catch' },
              { title: 'Multiple catch Clauses' },
              { title: 'Nested try Statements' },
              { title: 'throw' },
              { title: 'finally' },
              { title: 'Java Built-in Exceptions' },
              { title: 'Creating Custom Exception Subclasses' },
              { title: 'Resource Handling using Exceptions' },
            ],
          },
          {
            unitNumber: 7,
            title: 'Multithreaded Programming',
            topics: [
              { title: 'Java Thread Model' },
              { title: 'Main Thread' },
              { title: 'Creating Threads' },
              { title: 'Multiple Threads' },
              { title: 'isAlive()' },
              { title: 'join()' },
              { title: 'Thread Priorities' },
              { title: 'Synchronization' },
              { title: 'Inter-thread Communications' },
              { title: 'Suspending, Resuming and Stopping Threads' },
            ],
          },
          {
            unitNumber: 8,
            title: 'String Handling',
            topics: [
              { title: 'String Constructors' },
              { title: 'String Length' },
              { title: 'Special String Operations' },
              { title: 'Character Extraction' },
              { title: 'String Comparison' },
              { title: 'Searching Strings' },
              { title: 'Modifying Strings' },
              { title: 'Data Conversion' },
              { title: 'Changing Character Case' },
              { title: 'StringBuffer' },
              { title: 'StringBuilder' },
            ],
          },
          {
            unitNumber: 9,
            title: 'Collection Framework',
            topics: [
              { title: 'Iterator' },
              { title: 'Collection Framework' },
              { title: 'List' },
              { title: 'ArrayList' },
              { title: 'LinkedList' },
              { title: 'Vector' },
              { title: 'Stack' },
              { title: 'Queue' },
              { title: 'Deque' },
              { title: 'Priority Queue' },
              { title: 'Set' },
              { title: 'HashSet' },
              { title: 'TreeSet' },
            ],
          },
          {
            unitNumber: 10,
            title: 'Networking',
            topics: [
              { title: 'TCP/IP Client Sockets' },
              { title: 'URL' },
              { title: 'URL Connection' },
              { title: 'TCP/IP Server Sockets' },
              { title: 'Database Connectivity' },
            ],
          },
        ],
      },
      {
        name: 'Theory of Computation',
        code: 'BTCS-23503',
        semester: 5,
        ltpc: '3-0-0-3',
        section: 'Section A',
        isGlobal: true,
        description:
          'Core B.Tech CSE Section A subject covering finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability.',
        units: [
          {
            unitNumber: 1,
            title: 'Introduction',
            topics: [
              { title: 'Sets' },
              { title: 'Relations' },
              { title: 'Functions' },
              { title: 'Graphs' },
              { title: 'Strings' },
              { title: 'Alphabets' },
              { title: 'Languages' },
              { title: 'Chomsky Hierarchy of Grammar and Language' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Regular Grammar / Language and Finite Automata',
            topics: [
              { title: 'Definition of Finite Automata' },
              { title: 'Types of Finite Automata' },
              { title: 'Transition Systems' },
              { title: 'Equivalence of DFA and NDFA' },
              { title: 'Minimization of Finite Automata' },
              { title: 'Equivalence of Two-way Finite Automata' },
              { title: 'Conversion between Mealy and Moore Machines' },
              { title: 'Regular Expressions' },
              { title: 'Regular Grammar' },
              { title: 'Regular Language' },
              { title: 'Equivalence of Regular Expressions' },
              { title: 'Closure Properties of Regular Grammar' },
              { title: 'Pumping Lemma for Regular Language' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Context Free Grammar / Language and PDA',
            topics: [
              { title: 'Derivation and Types' },
              { title: 'Parsing' },
              { title: 'Ambiguous Grammar' },
              { title: 'Unambiguous Grammar' },
              { title: 'Context Free Language (CFL)' },
              { title: 'Chomsky Normal Form (CNF)' },
              { title: 'Greibach Normal Form (GNF)' },
              { title: 'Relation of PDA with CFG' },
              { title: 'Deterministic PDA' },
              { title: 'Non-deterministic PDA' },
              { title: 'Closure Properties of Context Free Grammar' },
              { title: 'Pumping Lemma for Context Free Language' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Context-sensitive Languages',
            topics: [{ title: 'Context-sensitive Grammars (CSG)' }],
          },
          {
            unitNumber: 5,
            title: 'Unrestricted Grammar / Language and Turing Machines',
            topics: [
              { title: 'Basic Model of Turing Machines' },
              { title: 'Variants of Turing Machines' },
              { title: 'Turing Recognizable (Recursively Enumerable) Languages' },
              { title: 'Turing Decidable (Recursive) Languages' },
              { title: 'Closure Properties of Recursive Languages' },
              { title: 'Unrestricted Grammars' },
              { title: 'Equivalence with Turing Machines' },
              { title: 'Halting Problem' },
              { title: 'Post Correspondence Problem (PCP)' },
              { title: 'LR(k) Grammars' },
              { title: 'Properties of LR(k) Grammars' },
              { title: 'Decidability' },
              { title: 'Undecidable Problems' },
            ],
          },
        ],
      },
      {
        name: 'Computer Networks',
        code: 'BTCS-23504',
        semester: 5,
        ltpc: '3-0-0-3',
        section: 'Section A',
        isGlobal: true,
        description:
          'Core B.Tech CSE Section A subject covering network models, data link protocols, medium access control, IP routing, transport protocols, and application layer protocols.',
        units: [
          {
            unitNumber: 1,
            title: 'Introduction',
            topics: [
              { title: 'Uses of Computer Networks' },
              { title: 'OSI Reference Model' },
              { title: 'TCP/IP Reference Model' },
              { title: 'Transmission Media Types' },
              { title: 'Network Topologies' },
              { title: 'Protocols' },
              { title: 'Standards' },
              { title: 'Wired Networks' },
              { title: 'Wireless Networks' },
              { title: 'Multiplexing' },
              { title: 'Frequency Division Multiplexing' },
              { title: 'Time Division Multiplexing' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Data Link Layer',
            topics: [
              { title: 'Error Detection' },
              { title: 'Error Correction' },
              { title: 'Hamming Code' },
              { title: 'CRC' },
              { title: 'Stop and Wait' },
              { title: 'Sliding Window' },
              { title: 'Go-back-N ARQ' },
              { title: 'Selective Repeat ARQ' },
              { title: 'Piggybacking' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Medium Access Sub Layer',
            topics: [
              { title: 'MAC Address' },
              { title: 'Pure ALOHA' },
              { title: 'Slotted ALOHA' },
              { title: 'CSMA' },
              { title: 'CSMA/CD' },
              { title: 'Binary Exponential Backoff Algorithm' },
              { title: 'Collision-free Protocols' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Network Layer',
            topics: [
              { title: 'IPv4' },
              { title: 'IPv6' },
              { title: 'CIDR' },
              { title: 'Subnet Mask' },
              { title: 'Default Gateway' },
              { title: 'DHCP' },
              { title: 'Circuit Switching' },
              { title: 'Packet Switching' },
              { title: 'Flooding' },
              { title: 'Distance Vector Routing' },
              { title: 'Link State Routing' },
              { title: 'Congestion Control Policies' },
              { title: 'Leaky Bucket Algorithm' },
              { title: 'Token Bucket Algorithm' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Transport Layer',
            topics: [
              { title: 'Port Numbers' },
              { title: 'Socket Address' },
              { title: 'Process to Process Communication' },
              { title: 'Connectionless Services' },
              { title: 'Connection Oriented Services' },
              { title: 'TCP' },
              { title: 'UDP' },
            ],
          },
          {
            unitNumber: 6,
            title: 'Application Layer',
            topics: [
              { title: 'DNS' },
              { title: 'TELNET' },
              { title: 'EMAIL' },
              { title: 'FTP' },
              { title: 'WWW' },
              { title: 'HTTP' },
              { title: 'SNMP' },
              { title: 'Firewalls' },
              { title: 'Basic Concepts of Cryptography' },
            ],
          },
        ],
      },
      {
        name: 'Organizational Behaviour',
        code: 'BTHS-23904',
        semester: 5,
        ltpc: '3-0-0-3',
        section: 'Section A',
        isGlobal: true,
        description:
          'Core B.Tech CSE Section A humanities subject covering individual and group behaviour, motivation, leadership, organization dynamics, and management principles.',
        units: [
          {
            unitNumber: 1,
            title: 'Introduction to Organisational Behaviour',
            topics: [
              { title: 'OB Model' },
              { title: 'Roles of Manager in OB' },
              { title: 'Douglas McGregor Theory X' },
              { title: 'Douglas McGregor Theory Y' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Foundation of Individual Behaviour',
            topics: [
              { title: 'Motivation' },
              { title: 'Personality' },
              { title: 'Values' },
              { title: 'Attitudes' },
              { title: 'Perception' },
              { title: 'Learning' },
              { title: 'Individual Decision-Making' },
              { title: 'Problem-Solving' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Foundation of Group Behaviour',
            topics: [
              { title: 'Communication' },
              { title: 'Leadership' },
              { title: 'Leadership Styles' },
              { title: 'Work Teams' },
              { title: 'Group Dynamics' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Foundation of the Organisation',
            topics: [
              { title: 'Organisation Structure' },
              { title: 'Organisation Culture' },
              { title: 'Organisational Conflict' },
              { title: 'Discipline' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Organisation Management',
            topics: [
              { title: 'Definition of Management' },
              { title: 'Functions of Management' },
              { title: 'Maslow Hierarchy' },
              { title: 'Principles of Henry Fayol' },
              { title: 'Principles of F. W. Taylor' },
            ],
          },
        ],
      },
    ];

    for (const subjectData of subjectsData) {
      const existing = await Subject.findOne({ code: subjectData.code });
      if (!existing) {
        await Subject.create(subjectData);
        console.log(`✅ Seeded ${subjectData.name} (${subjectData.code}) syllabus for Section A.`);
      } else {
        // Check if units are missing or empty
        if (!existing.units || existing.units.length === 0) {
          existing.units = subjectData.units;
          existing.semester = subjectData.semester;
          existing.ltpc = subjectData.ltpc;
          existing.section = subjectData.section;
          existing.isGlobal = true;
          await existing.save();
          console.log(`✅ Updated ${subjectData.name} (${subjectData.code}) with units syllabus.`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding subjects:', error.message);
  }
};

module.exports = seedSubjects;
