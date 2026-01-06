const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database', 'shambil_academy.sqlite'),
  logging: false
});

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Update classes and subjects for Nigerian school system
async function updateClassesAndSubjects() {
  try {
    console.log('🔄 Starting classes and subjects update for Nigerian school system...');
    
    // Disable foreign key constraints temporarily
    await sequelize.query('PRAGMA foreign_keys = OFF', { type: 'RAW' });
    
    // Clear existing classes and subjects to avoid conflicts
    console.log('🗑️ Clearing existing classes and subjects...');
    await sequelize.query('DELETE FROM Classes', { type: 'DELETE' });
    await sequelize.query('DELETE FROM Subjects', { type: 'DELETE' });
    
    // Re-enable foreign key constraints
    await sequelize.query('PRAGMA foreign_keys = ON', { type: 'RAW' });
    
    // Nigerian School Classes Structure
    const nigerianClasses = [
      // Early Years
      { name: 'KG', level: 'Kindergarten', capacity: 25, classTeacher: 1 },
      
      // Nursery
      { name: 'Nursery 1A', level: 'Nursery 1', capacity: 25, classTeacher: 2 },
      { name: 'Nursery 1B', level: 'Nursery 1', capacity: 25, classTeacher: 3 },
      { name: 'Nursery 2A', level: 'Nursery 2', capacity: 25, classTeacher: 4 },
      { name: 'Nursery 2B', level: 'Nursery 2', capacity: 25, classTeacher: 5 },
      
      // Primary School
      { name: 'Primary 1A', level: 'Primary 1', capacity: 30, classTeacher: 6 },
      { name: 'Primary 1B', level: 'Primary 1', capacity: 30, classTeacher: 7 },
      { name: 'Primary 2A', level: 'Primary 2', capacity: 30, classTeacher: 8 },
      { name: 'Primary 2B', level: 'Primary 2', capacity: 30, classTeacher: 9 },
      { name: 'Primary 3A', level: 'Primary 3', capacity: 30, classTeacher: 10 },
      { name: 'Primary 3B', level: 'Primary 3', capacity: 30, classTeacher: 11 },
      { name: 'Primary 4A', level: 'Primary 4', capacity: 30, classTeacher: 12 },
      { name: 'Primary 4B', level: 'Primary 4', capacity: 30, classTeacher: 1 },
      { name: 'Primary 5A', level: 'Primary 5', capacity: 30, classTeacher: 2 },
      { name: 'Primary 5B', level: 'Primary 5', capacity: 30, classTeacher: 3 },
      
      // Junior Secondary School (JSS)
      { name: 'JSS 1A', level: 'JSS 1', capacity: 35, classTeacher: 4 },
      { name: 'JSS 1B', level: 'JSS 1', capacity: 35, classTeacher: 5 },
      { name: 'JSS 1C', level: 'JSS 1', capacity: 35, classTeacher: 6 },
      { name: 'JSS 2A', level: 'JSS 2', capacity: 35, classTeacher: 7 },
      { name: 'JSS 2B', level: 'JSS 2', capacity: 35, classTeacher: 8 },
      { name: 'JSS 2C', level: 'JSS 2', capacity: 35, classTeacher: 9 },
      { name: 'JSS 3A', level: 'JSS 3', capacity: 35, classTeacher: 10 },
      { name: 'JSS 3B', level: 'JSS 3', capacity: 35, classTeacher: 11 },
      { name: 'JSS 3C', level: 'JSS 3', capacity: 35, classTeacher: 12 },
      
      // Senior Secondary School (SS) - Science & Arts
      { name: 'SS1 Science', level: 'SS 1', capacity: 30, classTeacher: 1 },
      { name: 'SS1 Arts', level: 'SS 1', capacity: 30, classTeacher: 2 },
      { name: 'SS2 Science', level: 'SS 2', capacity: 30, classTeacher: 3 },
      { name: 'SS2 Arts', level: 'SS 2', capacity: 30, classTeacher: 4 },
      { name: 'SS3 Science', level: 'SS 3', capacity: 30, classTeacher: 5 },
      { name: 'SS3 Arts', level: 'SS 3', capacity: 30, classTeacher: 6 }
    ];

    // Insert classes
    console.log('📚 Adding Nigerian school classes...');
    for (const classData of nigerianClasses) {
      await sequelize.query(`
        INSERT INTO Classes (name, level, capacity, classTeacher)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: [classData.name, classData.level, classData.capacity, classData.classTeacher],
        type: 'INSERT'
      });
    }

    // Nigerian School Subjects
    const nigerianSubjects = [
      // Core Subjects (All Levels)
      { name: 'English Language', code: 'ENG', description: 'English Language and Communication' },
      { name: 'Mathematics', code: 'MTH', description: 'Mathematics and Numeracy' },
      
      // Early Years & Primary Subjects
      { name: 'Rhymes', code: 'RHY', description: 'Nursery Rhymes and Songs' },
      { name: 'Quantitative Reasoning', code: 'QTR', description: 'Quantitative Reasoning and Logic' },
      { name: 'Verbal Reasoning', code: 'VBR', description: 'Verbal Reasoning and Comprehension' },
      { name: 'Drawing', code: 'DRW', description: 'Basic Drawing and Art' },
      
      // Primary & Secondary Subjects
      { name: 'Basic Science', code: 'BSC', description: 'Basic Science and Nature Study' },
      { name: 'Basic Technology', code: 'BTC', description: 'Basic Technology and Practical Skills' },
      { name: 'Social Studies', code: 'SOS', description: 'Social Studies and Citizenship' },
      { name: 'Civic Education', code: 'CIV', description: 'Civic Education and National Values' },
      { name: 'Physical and Health Education', code: 'PHE', description: 'Physical and Health Education' },
      { name: 'Agricultural Science', code: 'AGR', description: 'Agricultural Science and Farming' },
      { name: 'Computer Studies', code: 'CMP', description: 'Computer Studies and ICT' },
      { name: 'Fine Arts', code: 'ART', description: 'Fine Arts and Creative Expression' },
      
      // Language Subjects
      { name: 'Hausa', code: 'HAU', description: 'Hausa Language' },
      { name: 'Arabic', code: 'ARB', description: 'Arabic Language and Islamic Studies' },
      { name: 'Literature in English', code: 'LIT', description: 'Literature in English' },
      
      // Religious Studies
      { name: 'Islamic Religious Studies', code: 'IRS', description: 'Islamic Religious Studies' },
      { name: 'Christian Religious Studies', code: 'CRS', description: 'Christian Religious Studies' },
      
      // Science Subjects (Secondary)
      { name: 'Physics', code: 'PHY', description: 'Physics' },
      { name: 'Chemistry', code: 'CHE', description: 'Chemistry' },
      { name: 'Biology', code: 'BIO', description: 'Biology' },
      { name: 'Further Mathematics', code: 'FMT', description: 'Further Mathematics' },
      
      // Arts & Social Science Subjects (Secondary)
      { name: 'History', code: 'HIS', description: 'History' },
      { name: 'Geography', code: 'GEO', description: 'Geography' },
      { name: 'Government', code: 'GOV', description: 'Government' },
      { name: 'Economics', code: 'ECO', description: 'Economics' },
      
      // Commercial Subjects
      { name: 'Business Studies', code: 'BUS', description: 'Business Studies' },
      { name: 'Accounting', code: 'ACC', description: 'Financial Accounting' },
      { name: 'Marketing', code: 'MKT', description: 'Marketing and Commerce' },
      
      // Additional Subjects
      { name: 'French', code: 'FRE', description: 'French Language' },
      { name: 'Music', code: 'MUS', description: 'Music Theory and Practice' },
      { name: 'Home Economics', code: 'HEC', description: 'Home Economics and Life Skills' },
      { name: 'Technical Drawing', code: 'TDR', description: 'Technical Drawing and Design' }
    ];

    // Insert subjects
    console.log('📖 Adding Nigerian curriculum subjects...');
    for (const subjectData of nigerianSubjects) {
      await sequelize.query(`
        INSERT INTO Subjects (name, code, description)
        VALUES (?, ?, ?)
      `, {
        replacements: [subjectData.name, subjectData.code, subjectData.description],
        type: 'INSERT'
      });
    }

    console.log('✅ Nigerian school classes and subjects updated successfully!');
    
    // Display current counts
    const [classCount] = await sequelize.query('SELECT COUNT(*) as count FROM Classes', { type: 'SELECT' });
    const [subjectCount] = await sequelize.query('SELECT COUNT(*) as count FROM Subjects', { type: 'SELECT' });
    
    console.log(`📊 Total Classes: ${classCount.count}`);
    console.log(`📊 Total Subjects: ${subjectCount.count}`);
    
    // Display class breakdown
    console.log('\n📚 Class Structure:');
    console.log('🎯 Early Years: KG');
    console.log('🎯 Nursery: 1A, 1B, 2A, 2B');
    console.log('🎯 Primary: 1A-5B (10 classes)');
    console.log('🎯 JSS: 1A-3C (9 classes)');
    console.log('🎯 SS: Science & Arts streams (6 classes)');
    
  } catch (error) {
    console.error('❌ Error updating classes and subjects:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

// Run the update
async function main() {
  await testConnection();
  await updateClassesAndSubjects();
}

main().catch(console.error);